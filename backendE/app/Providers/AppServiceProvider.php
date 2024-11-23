<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\CustomQueueFailer;
use Illuminate\Contracts\Queue\FailedJobProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        
        $this->app->bind(FailedJobProvider::class, CustomQueueFailer::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
