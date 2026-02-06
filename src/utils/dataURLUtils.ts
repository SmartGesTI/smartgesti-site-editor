/**
 * Data URL Utilities
 * Helper functions for handling Data URLs (base64 encoded images/videos)
 * and uploading them to Supabase Storage
 */

import { UploadConfig } from '../editor/LandingPageEditor';

/**
 * Detect if a string is a Data URL
 */
export function isDataURL(str: string): boolean {
  return str?.startsWith('data:image/') || str?.startsWith('data:video/');
}

/**
 * Convert Data URL to Blob
 */
export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Upload a Data URL to Supabase Storage
 * @param dataURL - The data URL to upload
 * @param uploadConfig - Upload configuration (tenantId, schoolId, siteId, authToken)
 * @returns Promise with the public URL of the uploaded asset
 */
export async function uploadDataURL(
  dataURL: string,
  uploadConfig: UploadConfig
): Promise<string> {
  if (!uploadConfig?.tenantId) throw new Error('Upload config não disponível');

  const blob = dataURLtoBlob(dataURL);
  const file = new File([blob], 'image.png', { type: blob.type });

  const formData = new FormData();
  formData.append('file', file);

  const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001';
  const params = new URLSearchParams();
  params.append('tenantId', uploadConfig.tenantId);
  params.append('assetType', 'image');
  if (uploadConfig.schoolId) params.append('schoolId', uploadConfig.schoolId);
  if (uploadConfig.siteId) params.append('siteId', uploadConfig.siteId);

  const res = await fetch(`${apiUrl}/api/site-assets/upload?${params}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${uploadConfig.authToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Upload falhou');
  }

  const data = await res.json();
  return data.url;
}

/**
 * Process a block recursively to upload all Data URLs
 * @param block - The block to process
 * @param uploadConfig - Upload configuration
 * @returns Promise with the processed block (Data URLs replaced with uploaded URLs)
 */
export async function processBlockDataURLs(
  block: any,
  uploadConfig: UploadConfig
): Promise<any> {
  const newBlock = { ...block };

  // Processar props que podem ter imagens
  if (newBlock.props) {
    const newProps = { ...newBlock.props };

    // Processar logo (pode ser string ou objeto)
    if (newProps.logo) {
      if (typeof newProps.logo === 'string' && isDataURL(newProps.logo)) {
        newProps.logo = await uploadDataURL(newProps.logo, uploadConfig);
      } else if (typeof newProps.logo === 'object' && newProps.logo.src && isDataURL(newProps.logo.src)) {
        newProps.logo = { ...newProps.logo, src: await uploadDataURL(newProps.logo.src, uploadConfig) };
      }
    }

    // Processar image prop (hero, etc)
    if (newProps.image && typeof newProps.image === 'string' && isDataURL(newProps.image)) {
      newProps.image = await uploadDataURL(newProps.image, uploadConfig);
    }

    // Processar backgroundImage
    if (newProps.backgroundImage && typeof newProps.backgroundImage === 'string' && isDataURL(newProps.backgroundImage)) {
      newProps.backgroundImage = await uploadDataURL(newProps.backgroundImage, uploadConfig);
    }

    // Processar children recursivamente
    if (newProps.children && Array.isArray(newProps.children)) {
      newProps.children = await Promise.all(
        newProps.children.map((child: any) => processBlockDataURLs(child, uploadConfig))
      );
    }

    newBlock.props = newProps;
  }

  return newBlock;
}
