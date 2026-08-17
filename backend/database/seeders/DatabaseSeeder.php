<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\DamageReport;
use App\Models\MaintenanceLog;
use App\Models\MaintenanceSchedule;
use App\Models\User;
use App\Models\AssetCategory;
use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed default demo accounts safely with updateOrCreate
        $admin = User::updateOrCreate(
            ['email' => 'admin@sarpras.test'],
            ['name' => 'Admin Sarpras', 'password' => Hash::make('password'), 'role' => 'admin']
        );
        $adminFti = User::updateOrCreate(
            ['email' => 'admin@fti.uksw.edu'],
            ['name' => 'Admin FTI', 'password' => Hash::make('password'), 'role' => 'admin']
        );
        $teknisi = User::updateOrCreate(
            ['email' => 'teknisi@fti.uksw.edu'],
            ['name' => 'Teknisi FTI', 'password' => Hash::make('password'), 'role' => 'teknisi']
        );
        $readOnly = User::updateOrCreate(
            ['email' => 'user@fti.uksw.edu'],
            ['name' => 'Demo User (Read Only)', 'password' => Hash::make('password'), 'role' => 'staff']
        );
        $staff = User::updateOrCreate(
            ['email' => 'user@sarpras.test'],
            ['name' => 'Demo Staff', 'password' => Hash::make('password'), 'role' => 'staff']
        );

        $this->call([
            AssetCategorySeeder::class,
            LocationSeeder::class,
        ]);

        // Get categories and locations
        $categories = AssetCategory::all();
        $locations = Location::all();

        // 12 Assets
        $assets = [
            [
                'asset_code' => 'AST-ELK-001',
                'name' => 'AC Split Daikin 1.5 PK',
                'category_id' => $categories->where('name', 'Elektronik')->first()->id,
                'location_id' => $locations->where('room', 'R.101 (Lab Networking)')->first()->id,
                'condition' => 'baik',
                'purchase_date' => '2024-03-15',
                'purchase_price' => 6500000.00,
            ],
            [
                'asset_code' => 'AST-ELK-002',
                'name' => 'Proyektor Epson EB-X400',
                'category_id' => $categories->where('name', 'Elektronik')->first()->id,
                'location_id' => $locations->where('room', 'R.201 (Ruang Kuliah)')->first()->id,
                'condition' => 'baik',
                'purchase_date' => '2024-01-10',
                'purchase_price' => 5200000.00,
            ],
            [
                'asset_code' => 'AST-ELK-003',
                'name' => 'Server Dell PowerEdge R750',
                'category_id' => $categories->where('name', 'Elektronik')->first()->id,
                'location_id' => $locations->where('room', 'R.105 (Ruang Server)')->first()->id,
                'condition' => 'baik',
                'purchase_date' => '2023-08-20',
                'purchase_price' => 45000000.00,
            ],
            [
                'asset_code' => 'AST-ELK-004',
                'name' => 'PC iMac 24" Apple M3',
                'category_id' => $categories->where('name', 'Elektronik')->first()->id,
                'location_id' => $locations->where('room', 'R.205 (Lab Multimedia)')->first()->id,
                'condition' => 'baik',
                'purchase_date' => '2024-02-05',
                'purchase_price' => 24900000.00,
            ],
            [
                'asset_code' => 'AST-ELK-005',
                'name' => 'Access Point Cisco Catalyst',
                'category_id' => $categories->where('name', 'Elektronik')->first()->id,
                'location_id' => $locations->where('room', 'R.304 (Lab Programming)')->first()->id,
                'condition' => 'perbaikan',
                'purchase_date' => '2023-11-12',
                'purchase_price' => 3800000.00,
            ],
            [
                'asset_code' => 'AST-MEB-001',
                'name' => 'Meja Rapat Kayu Jati',
                'category_id' => $categories->where('name', 'Mebel')->first()->id,
                'location_id' => $locations->where('room', 'R.401 (Ruang Seminar)')->first()->id,
                'condition' => 'baik',
                'purchase_date' => '2023-05-18',
                'purchase_price' => 12000000.00,
            ],
            [
                'asset_code' => 'AST-MEB-002',
                'name' => 'Kursi Kerja Ergonomis',
                'category_id' => $categories->where('name', 'Mebel')->first()->id,
                'location_id' => $locations->where('room', 'R.301 (Ruang Dosen)')->first()->id,
                'condition' => 'baik',
                'purchase_date' => '2024-04-02',
                'purchase_price' => 1500000.00,
            ],
            [
                'asset_code' => 'AST-MEB-003',
                'name' => 'Lemari Arsip Besi Lion',
                'category_id' => $categories->where('name', 'Mebel')->first()->id,
                'location_id' => $locations->where('room', 'R.301 (Ruang Dosen)')->first()->id,
                'condition' => 'rusak_ringan',
                'purchase_date' => '2022-10-15',
                'purchase_price' => 2800000.00,
            ],
            [
                'asset_code' => 'AST-BGN-001',
                'name' => 'Pintu Kaca Utama R. Seminar',
                'category_id' => $categories->where('name', 'Bangunan')->first()->id,
                'location_id' => $locations->where('room', 'R.401 (Ruang Seminar)')->first()->id,
                'condition' => 'baik',
                'purchase_date' => '2023-05-01',
                'purchase_price' => 7500000.00,
            ],
            [
                'asset_code' => 'AST-BGN-002',
                'name' => 'Sistem Pencahayaan LED Auditorium',
                'category_id' => $categories->where('name', 'Bangunan')->first()->id,
                'location_id' => $locations->where('room', 'R.465 (Auditorium FTI)')->first()->id,
                'condition' => 'baik',
                'purchase_date' => '2023-06-25',
                'purchase_price' => 18500000.00,
            ],
        ];

        foreach ($assets as $assetData) {
            $createdAsset = Asset::create($assetData);

            // Generate temporary QR code payload URL
            $createdAsset->update([
                'qr_code_path' => 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' . $createdAsset->asset_code,
            ]);
        }

        // Seed some maintenance schedules
        $allAssets = Asset::all();
        
        $server = $allAssets->where('asset_code', 'AST-ELK-003')->first();
        $ac = $allAssets->where('asset_code', 'AST-ELK-001')->first();

        $schedule1 = MaintenanceSchedule::create([
            'asset_id' => $server->id,
            'maintenance_type' => 'Pembersihan Debu & Cek Kinerja Server',
            'frequency_months' => 3,
            'next_due_date' => now()->addMonths(1)->format('Y-m-d'),
        ]);

        $schedule2 = MaintenanceSchedule::create([
            'asset_id' => $ac->id,
            'maintenance_type' => 'Cuci AC & Tambah Freon',
            'frequency_months' => 6,
            'next_due_date' => now()->addMonths(2)->format('Y-m-d'),
        ]);

        // Seed some maintenance logs
        MaintenanceLog::create([
            'asset_id' => $ac->id,
            'schedule_id' => $schedule2->id,
            'technician_id' => $teknisi->id,
            'action_taken' => 'Telah dilakukan cuci filter AC dan penambahan freon R32.',
            'cost' => 350000.00,
            'maintenance_date' => now()->subMonths(3)->format('Y-m-d'),
        ]);

        MaintenanceLog::create([
            'asset_id' => $server->id,
            'schedule_id' => $schedule1->id,
            'technician_id' => $teknisi->id,
            'action_taken' => 'Pemberian thermal paste baru pada CPU server Dell Dell R750.',
            'cost' => 1200000.00,
            'maintenance_date' => now()->subMonths(2)->format('Y-m-d'),
        ]);

        // Seed some damage reports
        $ap = $allAssets->where('asset_code', 'AST-ELK-005')->first();

        DamageReport::create([
            'asset_id' => $ap->id,
            'reported_by' => $staff->id,
            'description' => 'Sinyal WiFi sering putus-putus dan mati sendiri di ruang Dosen.',
            'status' => 'diverifikasi',
        ]);
    }
}
