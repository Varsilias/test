<?php

namespace App\Console\Commands;

use App\Services\ReportsService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use PhpAmqpLib\Connection\AMQPSSLConnection;

class ListenToScanResults extends Command
{
    protected ReportsService $reportService;

    public function __construct(ReportsService $reportService){
        parent::__construct();

        $this->reportService = $reportService;
    }

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rabbitmq:listen-scan-results';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Listen to scan result queue';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $ssl_options = [
            'verify_peer' => false,
        ];

        $connection = new AMQPSSLConnection(
            env('RABBITMQ_HOST', 'b-f2d047e4-f970-4319-8894-57e997a2f5e5.mq.eu-west-2.amazonaws.com'),
            env('RABBITMQ_PORT', 5671),
            env('RABBITMQ_USERNAME', 'consent-protect'),
            env('RABBITMQ_PASSWORD', 'consent-protect-password'),
            env('RABBITMQ_VHOST', '/'),
            $ssl_options,
        );
        $channel = $connection->channel();

        $channel->queue_declare('scan_result_queue', false, true, false, false);

        $callback = function ($msg) {
            $data = json_decode($msg->body, true);

            $this->reportService->store($data['data']['data']);

            // Log::info('Received message: ' . print_r($data['data']['data'], true));
            // Process the message here
        };

        $channel->basic_consume('scan_result_queue', '', false, true, false, false, $callback);

        while ($channel->is_consuming()) {
            $channel->wait();
        }

        $channel->close();
        $connection->close();
    }
}
