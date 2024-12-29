import React, { useState, useEffect } from 'react';
import { searchVideos, getTrendingVideos, getChannelVideos } from '../services/api';
import { 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  FormControl, 
  InputLabel,
  Button,
  Dialog,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  channelId: string;
}

const categories = ['AI', 'Computer Vision', 'LLM'];

const VideoSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('AI');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchTrendingVideos();
  }, [selectedCategory]);

  const fetchTrendingVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTrendingVideos(selectedCategory);
      setVideos(response.videos);
    } catch (err) {
      setError('Failed to fetch trending videos. Please try again later.');
      console.error('Error fetching trending videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchTrendingVideos();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await searchVideos(searchQuery, selectedCategory);
      setVideos(response.videos);
    } catch (err) {
      setError('Failed to search videos. Please try again later.');
      console.error('Error searching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedVideo(null);
  };

  const handleChannelClick = async (channelId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getChannelVideos(channelId);
      setVideos(response.videos);
    } catch (err) {
      setError('Failed to fetch channel videos. Please try again later.');
      console.error('Error fetching channel videos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Videos
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          label="Search Videos"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchInputChange}
          onKeyPress={handleKeyPress}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography>Loading videos...</Typography>
      ) : (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={video.thumbnail}
                    alt={video.title}
                    sx={{ aspectRatio: '16/9', cursor: 'pointer' }}
                    onClick={() => handleVideoClick(video.id)}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      },
                    }}
                    onClick={() => handleVideoClick(video.id)}
                  >
                    <PlayArrowIcon sx={{ color: 'white', fontSize: 40 }} />
                  </IconButton>
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 1
                  }}>
                    {video.description}
                  </Typography>
                  <Tooltip title="Click to see channel videos">
                    <Typography 
                      variant="caption" 
                      color="primary"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => handleChannelClick(video.channelId)}
                    >
                      {video.channelTitle}
                    </Typography>
                  </Tooltip>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    • {new Date(video.publishedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ position: 'relative', pb: '56.25%', height: 0 }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              zIndex: 1,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <iframe
            src={`https://www.youtube.com/embed/${selectedVideo}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default VideoSection;
