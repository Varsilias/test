<?php

namespace App\Services;

use PhpAmqpLib\Connection\AMQPSSLConnection;
use PhpAmqpLib\Message\AMQPMessage;

class ScanService {
    protected $connection;
    protected $channel;

    public function __construct()
    {
        $ssl_options = array(
            'verify_peer' => false,
        );

        $this->connection = new AMQPSSLConnection(
            env('RABBITMQ_HOST', 'b-f2d047e4-f970-4319-8894-57e997a2f5e5.mq.eu-west-2.amazonaws.com'),
            env('RABBITMQ_PORT', 5671),
            env('RABBITMQ_USERNAME', 'consent-protect'),
            env('RABBITMQ_PASSWORD', 'consent-protect-password'),
            env('RABBITMQ_VHOST', '/'),
            $ssl_options,
        );
        $this->channel = $this->connection->channel();

        $this->channel->queue_declare('scan_request_queue', false, true, false, false);
    }

    public function sendToQueue($data)
    {
        $msg = new AMQPMessage(
            json_encode($data),
            ['delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT]
        );

        $this->channel->basic_publish($msg, '', 'scan_request_queue');
        return response()->json(['message' => 'Data sent to the scan request queue']);
    }

    public function __destruct()
    {
        $this->channel->close();
        $this->connection->close();
    }
}
