import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';

type RouteContext = {
  params: Promise<{
    fileId: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { profile } = await getCurrentUser();

    if (!profile) {
      return new NextResponse('Unauthorized', {
        status: 401,
      });
    }

    const { fileId } = await context.params;

    if (!fileId) {
      return new NextResponse('File ID is required', {
        status: 400,
      });
    }

    // Security:
    // Only allow the avatar belonging to the currently
    // authenticated user's profile.
    if (String(profile.avatarId ?? '') !== fileId) {
      return new NextResponse('Forbidden', {
        status: 403,
      });
    }

    const endpoint = appwriteConfig.endpoint.replace(/\/$/, '');

    const avatarUrl =
      `${endpoint}/storage/buckets/` +
      `${encodeURIComponent(appwriteConfig.avatarsBucketId)}/files/` +
      `${encodeURIComponent(fileId)}/view` +
      `?project=${encodeURIComponent(appwriteConfig.projectId)}`;

    const response = await fetch(avatarUrl, {
      method: 'GET',
      headers: {
        'X-Appwrite-Project': appwriteConfig.projectId,
        'X-Appwrite-Key': appwriteConfig.apiKey,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error('Appwrite avatar request failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        fileId,
      });

      return new NextResponse('Failed to load avatar', {
        status: response.status,
      });
    }

    const contentType =
      response.headers.get('content-type') ||
      'application/octet-stream';

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(arrayBuffer.byteLength),
        'Cache-Control':
          'private, no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Avatar route error:', error);

    return new NextResponse('Failed to load avatar', {
      status: 500,
    });
  }
}