<?php

namespace App\Providers;

use Aws\S3\S3Client;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\AwsS3V3\AwsS3V3Adapter;
use League\Flysystem\Filesystem;

class R2ServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Storage::extend('r2', function ($app, $config) {
            $client = new S3Client([
                'region' => $config['region'] ?? 'auto',
                'version' => 'latest',
                'endpoint' => $config['endpoint'],
                'use_path_style_endpoint' => $config['use_path_style_endpoint'] ?? false,
                'credentials' => [
                    'key' => $config['key'],
                    'secret' => $config['secret'],
                ],
                'http' => [
                    'verify' => true,
                    'curl' => [
                        CURLOPT_SSLVERSION => CURL_SSLVERSION_TLSv1_2,
                        CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1',
                    ],
                ],
            ]);

            $adapter = new AwsS3V3Adapter($client, $config['bucket']);

            return new Filesystem($adapter);
        });
    }
}
