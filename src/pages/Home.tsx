import { 
  Container, 
  Typography,
} from '@mui/material';
import VideoList from '../components/VideoList';

const Home = () => {

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Videolar
      </Typography>
      <VideoList />
    </Container>
  );
};

export default Home; 