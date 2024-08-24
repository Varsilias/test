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
        Schema::create('websites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('domain_id')->unique()->nullable();
            $table->string('name');
            $table->string('company_name')->nullable();
            $table->string('email')->nullable();
            $table->boolean('report_to_email')->default(false);
            $table->string('domain');
            $table->longText('logo')->nullable();
            $table->string('scan_frequency')->default('monthly');
            $table->json('config')->nullable();
            $table->boolean('showSettingsBtn')->default(true);
            $table->boolean('showCloseIcon')->default(false);
            $table->boolean('showBannerIcon')->default(false);
            $table->string('moreInfoBtnLink')->default('/privacy-policy/');
            $table->string('moreInfoBtnLabel')->default('Privacy Policy');
            $table->boolean('fullWidth')->default(true);
            $table->boolean('enableMinimize')->default(true);
            $table->string('displayPosition')->default('right');
            $table->string('primaryColor')->default('#09bf15');
            $table->string('bannerTitle')->default('Cookie consent');

            $table->string('primaryTextColor')->default('#ffffff');
            $table->string('primaryBtnColor')->default('#09bf15');
            $table->string('primaryBtnBorderColor')->default('#09bf15');
            $table->string('secondaryTextColor')->default('#ffffff');
            $table->string('secondaryBtnColor')->default('#1b70f5');
            $table->string('secondaryBtnBorderColor')->default('#1b70f5');
            $table->string('declineTextColor')->default('#09bf15');
            $table->string('declineBtnColor')->default('#ffffff');
            $table->string('declineBtnBorderColor')->default('#09bf15');
            $table->string('primaryBtnLabel')->default('Accept All');
            $table->string('declineInfoBtnLabel')->default('Reject All');
            $table->string('secondaryBtnLabel')->default('Accept Necessary');

            $table->boolean('consentWidgetMounted')->default(false);
            $table->boolean('cookiesTableMounted')->default(false);
            $table->boolean('openGtagDefaults')->default(false);

            $table->string('bannerDescription')->default('This website uses cookie or similar technologies, to enhance your browsing experience and provide personalised recommendations. By continuing to use our website, you agree to our.');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('websites');
    }
};
