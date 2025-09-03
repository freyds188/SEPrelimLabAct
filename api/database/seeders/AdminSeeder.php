<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AdminRole;
use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin roles
        $roles = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Administrator',
                'description' => 'Full system access with all permissions',
                'permissions' => AdminRole::getAvailablePermissions(),
                'is_active' => true,
            ],
            [
                'name' => 'content_admin',
                'display_name' => 'Content Administrator',
                'description' => 'Manages stories, campaigns, and glossary content',
                'permissions' => [
                    'stories.view', 'stories.create', 'stories.edit', 'stories.delete', 'stories.approve', 'stories.publish',
                    'campaigns.view', 'campaigns.create', 'campaigns.edit', 'campaigns.delete', 'campaigns.approve',
                    'glossary.view', 'glossary.create', 'glossary.edit', 'glossary.delete',
                    'announcements.create', 'announcements.edit', 'announcements.delete', 'announcements.publish',
                    'reports.generate', 'reports.export',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'product_admin',
                'display_name' => 'Product Administrator',
                'description' => 'Manages products, weavers, and inventory',
                'permissions' => [
                    'products.view', 'products.create', 'products.edit', 'products.delete', 'products.approve', 'products.bulk_upload',
                    'users.view', 'users.edit',
                    'weavers.view', 'weavers.edit',
                    'reports.generate', 'reports.export',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'financial_admin',
                'display_name' => 'Financial Administrator',
                'description' => 'Manages orders, payouts, and financial reports',
                'permissions' => [
                    'orders.view', 'orders.edit', 'orders.process', 'orders.refund',
                    'payouts.view', 'payouts.process', 'payouts.approve',
                    'donations.view', 'donations.process',
                    'reports.generate', 'reports.export',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'moderator',
                'display_name' => 'Content Moderator',
                'description' => 'Reviews and moderates user-generated content',
                'permissions' => [
                    'stories.view', 'stories.approve',
                    'campaigns.view', 'campaigns.approve',
                    'users.view',
                    'content.moderate',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($roles as $roleData) {
            AdminRole::create($roleData);
        }

        $this->command->info('✅ Admin roles created successfully!');

        // Create super admin user
        $superAdminRole = AdminRole::where('name', 'super_admin')->first();
        
        if ($superAdminRole) {
            // Create or find the CordiWeave user
            $cordiWeaveUser = User::where('email', 'admin@cordiweave.ph')->first();
            
            if (!$cordiWeaveUser) {
                $cordiWeaveUser = User::create([
                    'name' => 'CordiWeave Admin',
                    'email' => 'admin@cordiweave.ph',
                    'password' => Hash::make('admin123456'),
                    'email_verified_at' => now(),
                ]);
            }

            // Create admin user record
            $adminUser = AdminUser::where('user_id', $cordiWeaveUser->id)->first();
            
            if (!$adminUser) {
                AdminUser::create([
                    'user_id' => $cordiWeaveUser->id,
                    'admin_role_id' => $superAdminRole->id,
                    'admin_id' => AdminUser::generateAdminId(),
                    'department' => 'System Administration',
                    'is_active' => true,
                    'is_super_admin' => true,
                ]);
            }

            $this->command->info('✅ Super admin user created successfully!');
            $this->command->info('📧 Email: admin@cordiweave.ph');
            $this->command->info('🔑 Password: admin123456');
        }

        // Create additional admin users for testing
        $this->createTestAdmins();

        $this->command->info('🎉 Admin system setup completed successfully!');
    }

    /**
     * Create additional test admin users
     */
    private function createTestAdmins(): void
    {
        $roles = [
            'content_admin' => 'Content Team',
            'product_admin' => 'Product Team',
            'financial_admin' => 'Finance Team',
            'moderator' => 'Moderation Team',
        ];

        foreach ($roles as $roleName => $department) {
            $role = AdminRole::where('name', $roleName)->first();
            
            if ($role) {
                $email = str_replace('_', '', $roleName) . '@cordiweave.ph';
                $user = User::where('email', $email)->first();
                
                if (!$user) {
                    $user = User::create([
                        'name' => ucwords(str_replace('_', ' ', $roleName)) . ' User',
                        'email' => $email,
                        'password' => Hash::make('password123'),
                        'email_verified_at' => now(),
                    ]);
                }

                $adminUser = AdminUser::where('user_id', $user->id)->first();
                
                if (!$adminUser) {
                    AdminUser::create([
                        'user_id' => $user->id,
                        'admin_role_id' => $role->id,
                        'admin_id' => AdminUser::generateAdminId(),
                        'department' => $department,
                        'is_active' => true,
                        'is_super_admin' => false,
                    ]);
                }
            }
        }

        $this->command->info('✅ Test admin users created successfully!');
    }
}


