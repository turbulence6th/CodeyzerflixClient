import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, CircularProgress, Alert, Container, Pagination, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import { publicVideoService } from '../services/video.service';
import { Video, VideoFilter, VideoType } from '../types/video.types';
import { useLocation, useNavigate } from 'react-router-dom';

interface VideoListProps {
  details?: VideoFilter; // Filtreleme için opsiyonel prop
}

const VideoList: React.FC<VideoListProps> = ({ details }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const [page, setPage] = useState(parseInt(new URLSearchParams(location.search).get('page') || '1'));

  const [totalPages, setTotalPages] = useState(0); // Toplam sayfa sayısı
  const [pageSize] = useState(12); // Sayfa başına gösterilecek video sayısıü


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
      } catch (err) {
        console.error('Videolar yüklenirken hata:', err);
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
      }
    };

    fetchVideos();
  }, [details, page, pageSize]);

  // Sayfa değiştiğinde en üste kaydır
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

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
    const newPage = value;
    setPage(newPage);
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    navigate({ search: params.toString() }); 
  };

  return (
  !videos || videos.length === 0 ? (
        <Alert severity="info">Video bulunamadı.</Alert>
      ) : (
        <>
            <Grid container spacing={3}>
            {videos.map((video) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3}}  key={video.id}>
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
                                image={video.videoType === VideoType.SUNGER_BOB ? '/sunger_bob.webp' : '/cilgin_korsan_jack.webp'}
                                alt={video.title}
                                sx={{ 
                                    objectFit: 'contain',
                                    backgroundColor: video.videoType === VideoType.SUNGER_BOB ? '#FFEB3B' : '#87ceeb',
                                    padding: '10px'
                                }}
                            />
                        </Box>
                        <CardContent>
                        <Tooltip title={video.title} arrow>
                          <Typography variant="h6" noWrap>
                            {video.title}
                          </Typography>
                        </Tooltip>
                        
                        </CardContent>
                    </Card>
                </Grid>
            ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{ mt: 4 }}
                    variant="outlined" shape="rounded"
                    siblingCount={isMobile ? 0 : 1}
                />
            </Box>
        </>
      )
    )
};

export default VideoList;