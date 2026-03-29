<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Role;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasRoles, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected static function booted()
    {
        // static::created(function ($user) {

        //     if ($user->roles()->count() === 0) {
        //         $user->assignRole('Customer'); // default role
        //     }
        // });
    }

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'image',
        'otp_code',
        'otp_expires_at',
        'locked_until',
        'is_2fa_enabled',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'otp_expires_at' => 'datetime',
            'locked_until' => 'datetime',
            'is_2fa_enabled' => 'boolean',
        ];
    }

    /**
     * Check if the account is temporarily locked.
     */
    public function isLocked(): bool
    {
        return $this->locked_until && $this->locked_until->isFuture();
    }

    /**
     * Generate and save a new OTP code.
     */
    public function generateOtp(): string
    {
        $otp = sprintf("%06d", mt_rand(1, 999999));
        $this->update([
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10), // OTP valid for 10 minutes
        ]);
        return $otp;
    }

    /**
     * Clear the OTP code.
     */
    public function clearOtp(): void
    {
        $this->update([
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);
    }
    /** 
     * Get the role that owns the User
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new \App\Notifications\AdminResetPasswordNotification($token));
    }
}
