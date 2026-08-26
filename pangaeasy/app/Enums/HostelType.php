<?php

namespace App\Enums;

enum HostelType: string
{
    case BOYS = 'Boys';
    case GIRLS = 'Girls';
    case MIXED = 'Mixed';

    /**
     * Return all enum values
     */

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
