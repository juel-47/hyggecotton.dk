<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->index(['category_id', 'status', 'brand_id'], 'cat_status_brand_idx');
            $table->index(['category_id', 'status', 'price'], 'cat_status_price_idx');
            $table->index(['status', 'created_at'], 'status_created_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('cat_status_brand_idx');
            $table->dropIndex('cat_status_price_idx');
            $table->dropIndex('status_created_idx');
        });
    }
};
