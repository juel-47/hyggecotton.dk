<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\EmailConfiguration;
use App\Models\FooterInfo;
use App\Models\FooterSocial;
use App\Models\GeneralSetting;
use App\Models\LogoSetting;
use App\Models\Product;
use App\Models\Slider;
use App\Observers\CategoryObserver;
use App\Observers\FooterInfoObserver;
use App\Observers\FooterSocialObserver;
use App\Observers\LogoSettingObserver;
use App\Observers\ProductObserver;
use App\Observers\SliderObserver;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Paginator::useBootstrap();

        try {
            // Check if DB is reachable before doing anything
            \Illuminate\Support\Facades\DB::connection()->getPdo();

            // Cache GeneralSetting for 1 hour (3600 seconds)
            $generalSetting = null;
            if (Schema::hasTable('general_settings')) {
                $generalSetting = Cache::remember('general_setting', 3600, function () {
                    return GeneralSetting::first();
                });
            }

            $logoSetting = null;
            if (Schema::hasTable('logo_settings')) {
                $logoSetting = LogoSetting::first();
            }

            /** Set timezone */
            if ($generalSetting && $generalSetting->time_zone) {
                Config::set('app.timezone', $generalSetting->time_zone);
            }

            if (Schema::hasTable('email_configurations')) {
                $mailSetting = EmailConfiguration::first();
                if ($mailSetting) {
                    Config::set('mail.mailers.smtp.host', $mailSetting->host);
                    Config::set('mail.mailers.smtp.port', $mailSetting->port);
                    Config::set('mail.mailers.smtp.encryption', $mailSetting->encryption);
                    Config::set('mail.mailers.smtp.username', $mailSetting->username);
                    Config::set('mail.mailers.smtp.password', $mailSetting->password);

                    $fromEmail = $mailSetting->email ?? 'default@example.com';
                    $fromName = 'Hygee';
                    Config::set('mail.from.address', $fromEmail);
                    Config::set('mail.from.name', $fromName);

                    app()->forgetInstance('mail.manager');
                    app()->forgetInstance('mailer');
                    app('mail.manager')->mailer('smtp');
                }
            }

            /** Share variables with all views */
            View::composer('*', function ($view) use ($generalSetting, $logoSetting) {
                $view->with(['settings' => $generalSetting, 'logoSetting' => $logoSetting]);
            });

            /** observer register */
            Product::observe(ProductObserver::class);
            Category::observe(CategoryObserver::class);
            Slider::observe(SliderObserver::class);
            LogoSetting::observe(LogoSettingObserver::class);
            FooterInfo::observe(FooterInfoObserver::class);
            FooterSocial::observe(FooterSocialObserver::class);

        } catch (\Exception $e) {
            // Log the error but don't crash the boot process
            \Illuminate\Support\Facades\Log::error("Database connection failed in AppServiceProvider: " . $e->getMessage());
            
            // Share null variables to prevent undefined variable errors in layouts
            View::share('settings', null);
            View::share('logoSetting', null);
        }

        // Enforce strong passwords
        \Illuminate\Validation\Rules\Password::defaults(function () {
            return \Illuminate\Validation\Rules\Password::min(8)
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols()
                ->uncompromised();
        });

        // Register unified authentication security listeners
        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Auth\Events\Login::class,
            [\App\Listeners\AuthEventListener::class, 'handleLogin']
        );
        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Auth\Events\Failed::class,
            [\App\Listeners\AuthEventListener::class, 'handleFailed']
        );
        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Auth\Events\Logout::class,
            [\App\Listeners\AuthEventListener::class, 'handleLogout']
        );
    }
}
