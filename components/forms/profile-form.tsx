'use client';

import { useEffect, useState } from 'react';
import {
  updateMyProfile,
  uploadAvatar,
} from '@/actions/profile-actions';

type Profile = {
  $id: string;
  name?: string;
  email?: string;
  phone?: string;
  designation?: string;
  avatarId?: string;
  role?: string;
};

type Props = {
  profile: Profile;
};

export function ProfileForm({ profile }: Props) {
  const [name, setName] = useState(profile.name ?? '');
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [designation, setDesignation] = useState(
    profile.designation ?? '',
  );

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile.avatarId
      ? `/api/avatar/${profile.avatarId}`
      : null,
  );

  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile.avatarId) {
      setAvatarUrl(`/api/avatar/${profile.avatarId}?v=${Date.now()}`);
    } else {
      setAvatarUrl(null);
    }
  }, [profile.avatarId]);

  async function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatarLoading(true);
    setMessage('');
    setError('');

    const localPreview = URL.createObjectURL(file);

    setAvatarUrl(localPreview);

    try {
      const result = await uploadAvatar(file);

      if (!result.success || !result.avatarId) {
        throw new Error('Avatar upload failed.');
      }

      // Upload complete হলে Appwrite file-এর ID দিয়ে নিজের API route
      // থেকে image load হবে।
      setAvatarUrl(
        `/api/avatar/${result.avatarId}?v=${Date.now()}`,
      );

      setMessage('Avatar updated successfully.');
    } catch (error) {
      console.error('Avatar upload error:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to upload avatar.',
      );

      // Upload fail করলে আগের avatar restore
      setAvatarUrl(
        profile.avatarId
          ? `/api/avatar/${profile.avatarId}?v=${Date.now()}`
          : null,
      );
    } finally {
      setAvatarLoading(false);
      event.target.value = '';
    }
  }

  async function handleProfileSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await updateMyProfile({
        name,
        phone,
        designation,
      });

      setMessage('Profile updated successfully.');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update profile.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-slate-200 bg-slate-100">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name || 'Profile avatar'}
                className="h-full w-full object-cover"
                onError={() => {
                  console.error(
                    'Failed to display avatar:',
                    avatarUrl,
                  );
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-slate-400">
                {name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>

          <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
            {avatarLoading
              ? 'Uploading...'
              : 'Upload Picture'}

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={avatarLoading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <form
        onSubmit={handleProfileSubmit}
        className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
      >
        {message && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Name
          </label>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            value={profile.email ?? ''}
            disabled
            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Designation
          </label>

          <input
            value={designation}
            onChange={(event) =>
              setDesignation(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}