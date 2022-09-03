// https://docs.toast.com/ko/Contents%20Delivery/Image/ko/api-guide/
export interface UploadResponse {
  file: {
    isFolder: boolean; // 폴더 여부
    id: string; // 고유 ID
    url: string; // 이미지 서비스 Url
    name: string; // 이미지 이름
    path: string; // 이미지 절대 경로
    bytes: number; // 이미지 파일 크기
    createdBy: string; // 이미지 구분 (U: 사용자 업로드 이미지, P: 오퍼레이션 이미지)
    updatedAt: string; // 최종 수정일
    operationId: number; // createdBy === P의 경우 참조된 오퍼레이션 ID
  };
}
