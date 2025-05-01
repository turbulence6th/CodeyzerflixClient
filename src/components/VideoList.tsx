import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, CircularProgress, Alert, Container, Pagination, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import { publicVideoService } from '../services/video.service';
import { Video, VideoFilter, VideoType } from '../types/video.types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

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

  const [debouncedKeyword] = useDebounce(details?.keyword, 500);

  // Debounce edilmiş `details` objesini yeniden oluştur
  const debouncedDetails = useMemo(() => ({
    ...details,
    keyword: debouncedKeyword
  }), [details?.videoType, debouncedKeyword]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await publicVideoService.getAllVideos({
          page,
          size: pageSize,
          details: debouncedDetails
        });
        setTotalPages(response.data.totalPages);
        setVideos(response.data.data);
      } catch (err) {
        console.error('Videolar yüklenirken hata:', err);
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
      }
    };
  
    fetchVideos();
  }, [debouncedDetails, page, pageSize]);

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
                        
                            <CardMedia
                                component="img"
                                image={`http://localhost:8080/videos/video/frame?videoId=${video.id}&time=00:07:12`}
                                alt={video.title}
                                sx={{ 
                                  width: '100%', // Genişliği %100 yaparak kartın tamamını kaplar
                                  height: 'auto', // Yüksekliği otomatik ayarlayın
                                  aspectRatio: '4 / 3', // En boy oranını 4:3 olarak ayarlayın
                                  objectFit: 'fill' // Resmi kapsayacak şekilde ayarlayın
                              }}
                            />
                        
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