<?php

namespace App\Enums;

enum HostelStatus: string
{
    case PENDING = 'Pending';
    case APPROVED = 'Approved';
    case REJECTED = 'Rejected';

    /**
     * Return all enum values
     */

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
