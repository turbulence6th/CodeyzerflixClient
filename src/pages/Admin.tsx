import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  Pagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { adminVideoService } from '../services/video.service';
import { Video, VideoFilter, VideoType, VideoSaveRequest } from '../types/video.types';
import { CodeyzerPaginationRequest } from '../types/codeyzerflix.types';

const Admin: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoUploadRequest, setVideoUploadRequest] = useState<VideoSaveRequest>({
    title: '',
    videoType: VideoType.SUNGER_BOB,
    fileId: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [page, setPage] = useState(1); // Sayfa numarası
  const [totalPages, setTotalPages] = useState(0); // Toplam sayfa sayısı
  const [pageSize] = useState(12); // Sayfa başına gösterilecek video sayısı

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const fetchVideos = async () => {
    try {
      const request: CodeyzerPaginationRequest<VideoFilter> = {
        page: page,
        size: pageSize
      };
      const response = await adminVideoService.getAllAdminVideos(request);
      
      setTotalPages(response.data.totalPages);
      setVideos(response.data.data);
    } catch (error) {
      showSnackbar('Videolar yüklenirken bir hata oluştu', 'error');
    }
  };

  const handleUploadClick = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setVideoUploadRequest({
      title: '',
      videoType: VideoType.SUNGER_BOB,
      fileId: ''
    });
  };

  const handleDeleteClick = (video: Video) => {
    setSelectedVideo(video);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedVideo(null);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      const { data } = await adminVideoService.uploadVideo(formData);
      setVideoUploadRequest({ ...videoUploadRequest, fileId: data });
    }
  };

  const handleSave = async () => {
    if (!videoUploadRequest.fileId || !videoUploadRequest.title || !videoUploadRequest.videoType) {
      showSnackbar('Lütfen video dosyası ve başlık girin', 'error');
      return;
    }

    try {
      const { data } = await adminVideoService.saveVideo(videoUploadRequest);
      showSnackbar('Video başarıyla yüklendi', 'success');
      handleCloseUploadDialog();
      fetchVideos();
    } catch (error) {
      showSnackbar('Video yüklenirken bir hata oluştu', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedVideo) return;

    try {
      await adminVideoService.deleteVideo(selectedVideo.id);
      showSnackbar('Video başarıyla silindi', 'success');
      handleCloseDeleteDialog();
      fetchVideos();
    } catch (error) {
      showSnackbar('Video silinirken bir hata oluştu', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); 
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Video Yönetimi
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadClick}
            sx={{ mr: 2 }}
          >
            Video Yükle
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <Card>
               <Box sx={{ position: 'relative' }}>
                 <CardMedia
                    component="img"
                    height="140"
                    image={'/sunger_bob.webp'}
                    alt={video.title}
                    sx={{ 
                      objectFit: 'contain',
                      backgroundColor: '#f5f5f5',
                      padding: '10px'
                    }}
                  />
               </Box>
              <CardContent>
                <Typography variant="h6" noWrap>
                  {video.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(video)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 4 }}
      />

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Video Yükle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Başlık"
            type="text"
            fullWidth
            value={videoUploadRequest.title}
            onChange={(e) => setVideoUploadRequest({ ...videoUploadRequest, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Video Dosyası
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              Dosya Ekle
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Seçilen: {file.name}
              </Typography>
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Video Türü
            </Typography>
            <Select
              fullWidth
              value={videoUploadRequest.videoType}
              onChange={(e) => setVideoUploadRequest({ ...videoUploadRequest, videoType: e.target.value as VideoType })} // Seçim değiştiğinde videoType'ı güncelliyoruz
            >
              <MenuItem value={VideoType.SUNGER_BOB}>Sünger Bob</MenuItem>
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>İptal</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Video Sil</DialogTitle>
        <DialogContent>
          <Typography>
            "{selectedVideo?.title}" videosunu silmek istediğinize emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>İptal</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin; 