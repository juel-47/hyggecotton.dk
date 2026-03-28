<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use ZipArchive;

class SystemBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Daily backup of database and product images';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting System Backup...');

        $date = now()->format('Y-m-d_H-i-s');
        $backupPath = storage_path('app/backups/' . $date);

        if (!File::exists($backupPath)) {
            File::makeDirectory($backupPath, 0755, true);
        }

        // 1. Database Backup
        $dbName = config('database.connections.mysql.database');
        $dbUser = config('database.connections.mysql.username');
        $dbPass = config('database.connections.mysql.password');
        $dbHost = config('database.connections.mysql.host');
        
        $sqlFile = "{$backupPath}/database_backup.sql";
        
        // Get mysqldump path from env or default to "mysqldump"
        $dumpBinary = env('MYSQLDUMP_PATH', 'mysqldump');
        
        // Use fromShellCommandline to allow output redirection (>) securely
        $command = sprintf(
            '%s --user=%s --password=%s --host=%s %s > %s',
            $dumpBinary, // External binary path
            escapeshellarg($dbUser),
            escapeshellarg($dbPass),
            escapeshellarg($dbHost),
            escapeshellarg($dbName),
            escapeshellarg($sqlFile)
        );

        $process = \Symfony\Component\Process\Process::fromShellCommandline($command);
        $process->setTimeout(300); // 5 minutes timeout
        $process->run();

        if ($process->isSuccessful()) {
            $this->info('Database backed up to: ' . $sqlFile);
        } else {
            $errorOutput = $process->getErrorOutput();
            $this->error('Database backup failed.');
            $this->error('Error signal: ' . ($errorOutput ?: 'Unknown error'));
            $this->line('Command tried: ' . $process->getCommandLine());
            $this->info('TIP: If "mysqldump" is not found, set MYSQLDUMP_PATH in your .env file to the full path of the binary.');
        }

        // 2. Image Backup (Zipping uploads folder)
        if (!class_exists('ZipArchive')) {
            $this->error('PHP ZipArchive extension is not installed. Skipping image backup.');
        } else {
            $zipFile = "{$backupPath}/images_backup.zip";
            $zip = new ZipArchive();
            
            if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
                $uploadsPath = public_path('uploads');
                if (File::exists($uploadsPath)) {
                    $files = File::allFiles($uploadsPath);
                    foreach ($files as $file) {
                        $zip->addFile($file->getRealPath(), 'uploads/' . $file->getRelativePathname());
                    }
                    $zip->close();
                    $this->info('Images backed up to: ' . $zipFile);
                } else {
                    $this->warn('Uploads folder not found. Skipping image backup.');
                }
            } else {
                $this->error('Failed to create Image ZIP');
            }
        }

        $this->info('Backup process completed.');
        
        // Optional: Delete backups older than 7 days
        $this->cleanupOldBackups();

        return 0;
    }

    private function cleanupOldBackups()
    {
        $backupsDir = storage_path('app/backups');
        if (File::exists($backupsDir)) {
            $folders = File::directories($backupsDir);
            foreach ($folders as $folder) {
                if (File::lastModified($folder) < now()->subDays(7)->getTimestamp()) {
                    File::deleteDirectory($folder);
                    $this->info('Deleted old backup: ' . basename($folder));
                }
            }
        }
    }
}
