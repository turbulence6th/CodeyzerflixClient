export enum VideoType {
  SUNGER_BOB = 'SUNGER_BOB',
  CILGIN_KORSAN_JACK = 'CILGIN_KORSAN_JACK'
}

export interface Video {
  id: string;
  title: string;
  fileName: string;
  contentType: string;
  videoType: VideoType;
}

export interface VideoFilter {
  videoType?: VideoType;
  keyword?: string;
}

export interface VideoSaveRequest {
  title: string;
  videoType: VideoType;
  fileId: string;
}

export interface VideoUpdateRequest {
  title: string;
  videoType: VideoType;
}
