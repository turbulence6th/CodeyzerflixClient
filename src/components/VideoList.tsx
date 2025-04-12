import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, CircularProgress, Alert, Container, Pagination } from '@mui/material';
import { publicVideoService } from '../services/video.service';
import { Video, VideoFilter } from '../types/video.types';
import { useNavigate } from 'react-router-dom';

interface VideoListProps {
  details?: VideoFilter; // Filtreleme için opsiyonel prop
}

const VideoList: React.FC<VideoListProps> = ({ details }) => {
  const navigate = useNavigate();

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1); // Sayfa numarası
  const [totalPages, setTotalPages] = useState(0); // Toplam sayfa sayısı
  const [pageSize] = useState(12); // Sayfa başına gösterilecek video sayısı


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await publicVideoService.getAllVideos({ 
          page: page, 
          size: pageSize, 
          details: details || {} // Filtre varsa kullan, yoksa boş nesne
        });
        setTotalPages(response.data.totalPages);
        setVideos(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Videolar yüklenirken hata:', err);
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
        setLoading(false);
      }
    };

    fetchVideos();
  }, [details]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const handleVideoClick = (videoId: string) => {
    navigate(`/watch/${videoId}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); 
  };

  return (
  <>
    {!videos || videos.length === 0 ? (
        <Alert severity="info">Video bulunamadı.</Alert>
      ) : (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
                onClick={() => handleVideoClick(video.id)}
              >
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
                  
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 4 }}
      />
  </>
  )
    
      
};

export default VideoList;