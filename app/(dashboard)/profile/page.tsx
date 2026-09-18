import { getCurrentUser } from '@/lib/appwrite/server';
import { ProfileForm } from '@/components/forms/profile-form';

export default async function ProfilePage() {
  const { profile } = await getCurrentUser();

  if (!profile) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update your profile information and avatar.
        </p>
      </div>

      <ProfileForm
        profile={{
          $id: String(profile.$id),
          name: String(profile.name ?? ''),
          email: String(profile.email ?? ''),
          phone: String(profile.phone ?? ''),
          designation: String(profile.designation ?? ''),
          avatarId: String(profile.avatarId ?? ''),
          role: String(profile.role ?? ''),
        }}
      />
    </div>
  );
}