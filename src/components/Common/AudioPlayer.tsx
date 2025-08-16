import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  title: string;
  content: string;
}

export const AudioPlayer = ({ title, content }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Mock audio URL - in real app this would come from text-to-speech service
  const audioUrl = "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      const seekTime = (value[0] / 100) * duration;
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = newSpeed;
      setSpeed(newSpeed);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-lg overflow-hidden"
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
              className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg"
            >
              <i className="fas fa-headphones text-white text-lg"></i>
            </motion.div>
            <div>
              <h3 className="font-semibold text-lg">Listen to Article</h3>
              <p className="text-sm text-muted-foreground truncate max-w-xs">
                {title}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </Button>
        </div>
      </div>

      {/* Player Controls */}
      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(-10)}
            className="w-10 h-10 rounded-full"
          >
            <i className="fas fa-backward text-sm"></i>
          </Button>
          
          <Button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : isPlaying ? (
              <i className="fas fa-pause text-lg"></i>
            ) : (
              <i className="fas fa-play text-lg ml-1"></i>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(10)}
            className="w-10 h-10 rounded-full"
          >
            <i className="fas fa-forward text-sm"></i>
          </Button>
        </div>

        {/* Extended Controls */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-primary/20"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Volume</span>
                  <span className="text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-volume-down text-muted-foreground"></i>
                  <Slider
                    value={[volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <i className="fas fa-volume-up text-muted-foreground"></i>
                </div>
              </div>

              {/* Speed Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Speed</span>
                  <span className="text-xs text-muted-foreground">{speed}x</span>
                </div>
                <div className="flex space-x-1">
                  {[0.75, 1, 1.25, 1.5, 2].map((speedOption) => (
                    <Button
                      key={speedOption}
                      variant={speed === speedOption ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSpeedChange(speedOption)}
                      className="text-xs px-2 py-1 h-8"
                    >
                      {speedOption}x
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <i className="fas fa-download mr-1"></i>
                  Download
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <i className="fas fa-share mr-1"></i>
                  Share Audio
                </button>
              </div>
              <div className="text-muted-foreground">
                <i className="fas fa-robot mr-1"></i>
                AI Generated
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Background Animation */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse"></div>
        </div>
      )}
    </motion.div>
  );
};