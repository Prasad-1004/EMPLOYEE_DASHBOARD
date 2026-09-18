'use client';

import { useState } from 'react';
import { uploadAvatar } from '@/actions/profile-actions';

export function AvatarUploader() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const input = event.currentTarget.elements.namedItem(
      'avatar',
    ) as HTMLInputElement | null;

    const file = input?.files?.[0];

    if (!file) {
      setMessage('Please select an image.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await uploadAvatar(file);

      if (result.success) {
        setMessage('Profile picture updated.');
        window.location.reload();
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Failed to upload profile picture.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="font-semibold">Profile picture</h2>

      <input
        className="mt-3 w-full text-sm"
        type="file"
        name="avatar"
        accept="image/jpeg,image/png,image/webp"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload picture'}
      </button>

      {message && (
        <p className="mt-3 text-sm text-slate-600">
          {message}
        </p>
      )}
    </form>
  );
}