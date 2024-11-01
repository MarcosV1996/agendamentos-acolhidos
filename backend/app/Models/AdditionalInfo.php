<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdditionalInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id', 
        'ethnicity',
        'addictions',
        'is_accompanied',
        'benefits',
        'is_lactating',
        'has_disability',
        'reason_for_accommodation', // Novo campo adicionado
        'has_religion', // Novo campo adicionado
        'religion', // Novo campo adicionado
        'has_chronic_disease', // Novo campo adicionado
        'chronic_disease', // Novo campo adicionado
        'education_level', // Novo campo adicionado
        'nationality', // Novo campo adicionado
        'room_id',     
        'bed_id',
        
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    // Relacionamento com Room
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    // Relacionamento com Bed
    public function bed()
    {
        return $this->belongsTo(Bed::class);
    }
}
