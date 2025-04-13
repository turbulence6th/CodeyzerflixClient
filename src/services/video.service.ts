import axios, { AxiosProgressEvent } from 'axios';
import { Video, VideoFilter, VideoSaveRequest, VideoUpdateRequest } from '../types/video.types';
import { CodeyzerPaginationRequest, CodeyzerPaginationResponse } from '../types/codeyzerflix.types';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8081' 
  : 'https://codeyzerflixapi.tail9fb8f4.ts.net'; // Ortama göre ayarlandı

const ADMIN_API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080' 
  : 'https://codeyzerflixadmin.tail9fb8f4.ts.net'; // Ortama göre ayarlandı

// Video stream URL'ini oluşturan yardımcı fonksiyon
export const getVideoStreamUrl = (videoId: string) => `${API_BASE_URL}/videos/${videoId}/stream`;

// Public API endpoints
export const publicVideoService = {
  // Video işlemleri
  getAllVideos: (request: CodeyzerPaginationRequest<VideoFilter>) => axios.post<CodeyzerPaginationResponse<Video>>(`${API_BASE_URL}/videos`, request),
  getVideoById: (videoId: string) => axios.get<Video>(`${API_BASE_URL}/videos/${videoId}`),
};

// Admin API endpoints
export const adminVideoService = {
  // Video yönetimi
  getAllAdminVideos: (request: CodeyzerPaginationRequest<VideoFilter>) => axios.post<CodeyzerPaginationResponse<Video>>(`${ADMIN_API_BASE_URL}/videos`, request),
  saveVideo: (request: VideoSaveRequest) => axios.post<Video>(`${ADMIN_API_BASE_URL}/videos/save`, request),
  updateVideo: (videoId: string, request: VideoUpdateRequest) => axios.post<Video>(`${ADMIN_API_BASE_URL}/videos/update/${videoId}`, request),
  getAdminVideoById: (videoId: string) => axios.get<Video>(`${ADMIN_API_BASE_URL}/videos/${videoId}`),
  deleteVideo: (videoId: string) => axios.post<void>(`${ADMIN_API_BASE_URL}/videos/delete/${videoId}`),
  uploadVideo: (formData: FormData, config: { onUploadProgress: (progress: AxiosProgressEvent) => void }) => axios.post<string>(`${ADMIN_API_BASE_URL}/videos/upload`, formData, { onUploadProgress: config.onUploadProgress }),
}; 