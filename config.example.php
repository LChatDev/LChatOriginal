<?php
declare(strict_types=1);
if (!defined('LCHAT_INTERNAL')) { http_response_code(404); exit; }

return [
    'public_url' => 'https://chat.example.com/',
    'storage_dir' => __DIR__ . '/files',
    // Preserve this private key file across deployments to read encrypted history.
    'message_key_file' => getenv('LCHAT_MESSAGE_KEY_FILE') ?: '',
    // TLS SMTP for registration and password-reset email. Keep credentials private.
    'smtp' => [
        'host' => getenv('LCHAT_SMTP_HOST') ?: '',
        'port' => 465,
        'username' => getenv('LCHAT_SMTP_USER') ?: '',
        'password' => getenv('LCHAT_SMTP_PASSWORD') ?: '',
    ],

    'database' => [
        'dsn' => 'mysql:host=localhost;port=3306;dbname=YOUR_DATABASE;charset=utf8mb4',
        'username' => 'YOUR_DATABASE_USER',
        'password' => 'YOUR_DATABASE_PASSWORD',
    ],
    'install_key' => 'REPLACE_WITH_A_LONG_RANDOM_SECRET',
    // Public name shown in the web interface. Existing installations default to LChat.
    'site_name' => 'LChat',
    // The registered user who becomes owner on a fresh installation.
    'initial_admin_username' => 'leosmleol',
    'registration_open' => true,
    'session_name' => 'lchat_session',
    'session_domain' => '',
    // WebRTC uses a mesh connection; keep group calls small.
    'max_call_participants' => 8,
    'ice_servers' => [
        ['urls' => 'stun:stun.l.google.com:19302'],
    ],
    'turn' => [
        'urls' => '',
        'secret' => '',
        'ttl' => 3600,
    ],
    'call_transport' => 'all',
];
