import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { motion, useDragControls } from 'framer-motion';
import { ImagePlus, Shirt, Type, Move, Maximize2, Minimize2 } from 'lucide-react';

const TShirtCustomizer = () => {
  const [theme, setTheme] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [displayText, setDisplayText] = useState('');
  const [textSize, setTextSize] = useState(50);
  const [imageSize, setImageSize] = useState(50);
  const [textColor, setTextColor] = useState('white');
  const [textBackground, setTextBackground] = useState(false);
  const [shirtColor, setShirtColor] = useState('black');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [hasText, setHasText] = useState(false);
  const previewRef = useRef(null);
  const shirtBoundsRef = useRef(null);
  const textDragControls = useDragControls();
  const imageDragControls = useDragControls();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      height: '180cm',
      weight: '80kg',
      build: 'athletic'
    }
  });

  const themes = [
    {
      name: 'Minimal',
      bg: 'bg-white',
      text: 'text-gray-800',
      accent: 'bg-indigo-500',
      button: 'bg-indigo-500 hover:bg-indigo-600',
      panel: 'bg-gray-50 border border-gray-100',
      input: 'border-gray-200',
      shadow: 'shadow-sm'
    },
    {
      name: 'Dark',
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      accent: 'bg-emerald-500',
      button: 'bg-emerald-500 hover:bg-emerald-600',
      panel: 'bg-gray-800 border border-gray-700',
      input: 'border-gray-700',
      shadow: 'shadow-md shadow-gray-800/50'
    },
    {
      name: 'Vintage',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      accent: 'bg-rose-500',
      button: 'bg-rose-500 hover:bg-rose-600',
      panel: 'bg-amber-100 border border-amber-200',
      input: 'border-amber-300',
      shadow: 'shadow-sm shadow-amber-200'
    }
  ];

  const calculateSize = (value, min, max) => {
    return min + (value / 100) * (max - min);
  };

  const textFontSize = calculateSize(textSize, 14, 32);
  const imageWidthPercentage = calculateSize(imageSize, 20, 40);

  const handleTextChange = (e) => {
    const input = e.target.value;
    if (input.length <= 15) {
      setDisplayText(input);
      setHasText(input.length > 0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'q') {
        setTheme((prev) => (prev + 1) % themes.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const onSubmit = (data) => {
    console.log('Form submitted with:', { 
      ...data, 
      displayText,
      previewImage,
      textSize,
      imageSize,
      textColor,
      textBackground,
      shirtColor,
      textPosition,
      imagePosition
    });
    alert('T-Shirt design submitted!');
  };

  const getShirtBounds = () => {
    if (shirtBoundsRef.current) {
      const rect = shirtBoundsRef.current.getBoundingClientRect();
      return {
        left: -rect.width / 2,
        right: rect.width / 2,
        top: -rect.height / 2,
        bottom: rect.height / 2
      };
    }
    return {};
  };

  return (
    <div className={`min-h-screen ${themes[theme].bg} ${themes[theme].text} p-2 md:p-4 overflow-hidden`}>
      <div className="max-w-6xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        <h1 className={`text-xl md:text-2xl font-bold mb-2 ${themes[theme].accent} text-white p-2 md:p-3 rounded-lg text-center ${themes[theme].shadow}`}>
          Premium T-Shirt Designer
        </h1>

        <div className="flex flex-col lg:flex-row gap-2 md:gap-4 flex-1 overflow-hidden">
          {/* Preview Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className={`p-2 md:p-4 rounded-lg ${themes[theme].panel} ${themes[theme].shadow} flex-1 flex flex-col min-h-0`}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base md:text-lg font-semibold flex items-center gap-1 md:gap-2">
                  <Shirt className="w-3 h-3 md:w-4 md:h-4" /> Design Preview
                </h2>
                <div className="flex gap-1">
                  {['black', 'white', 'red', 'green', 'yellow'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setShirtColor(color)}
                      className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${color === shirtColor ? 'ring-1 ring-offset-1 ring-gray-500' : ''}`}
                      style={{ backgroundColor: color }}
                      aria-label={`${color} t-shirt`}
                    />
                  ))}
                </div>
              </div>
              
              <div 
                ref={previewRef}
                className="relative flex-1 flex justify-center items-center bg-gray-100 rounded-xl overflow-hidden min-h-0"
              >
                <div 
                  ref={shirtBoundsRef}
                  className="absolute h-full w-full flex justify-center items-center pointer-events-none"
                >
                  <img
                    src={`/tshirt-${shirtColor}.png`}
                    alt={`${shirtColor} T-shirt`}
                    className="h-full object-contain select-none"
                  />
                </div>
                
                {previewImage && (
                  <motion.div
                    className="absolute cursor-move flex items-center justify-center"
                    style={{
                      width: `${imageWidthPercentage}%`,
                      x: imagePosition.x,
                      y: imagePosition.y
                    }}
                    drag
                    dragControls={imageDragControls}
                    dragConstraints={getShirtBounds()}
                    dragElastic={0}
                    dragMomentum={false}
                    onDrag={(event, info) => {
                      setImagePosition({ x: info.point.x, y: info.point.y });
                    }}
                  >
                    <div className="relative group">
                      <img
                        src={previewImage}
                        alt="Custom print"
                        className="w-full h-auto object-contain pointer-events-none"
                      />
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Move className="w-4 h-4 text-white bg-black bg-opacity-50 rounded-full p-1" />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {hasText && (
                  <motion.div
                    className={`absolute cursor-move font-bold px-2 rounded ${
                      textBackground ? 'bg-black bg-opacity-70' : ''
                    }`}
                    style={{ 
                      color: textColor,
                      fontSize: `${textFontSize}px`,
                      x: textPosition.x,
                      y: textPosition.y
                    }}
                    drag
                    dragControls={textDragControls}
                    dragConstraints={getShirtBounds()}
                    dragElastic={0}
                    dragMomentum={false}
                    onDrag={(event, info) => {
                      setTextPosition({ x: info.point.x, y: info.point.y });
                    }}
                  >
                    <div className="relative group">
                      {displayText}
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Move className="w-3 h-3 text-white bg-black bg-opacity-50 rounded-full p-0.5" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {!previewImage && !hasText && (
                <div className="text-center text-gray-400 mt-2 text-xs md:text-sm">
                  <p>Add an image or text to see your design</p>
                </div>
              )}
            </div>
          </div>

          {/* Customization Controls */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 md:space-y-4">
              {/* Body Measurements */}
              <div className={`p-2 md:p-4 rounded-lg ${themes[theme].panel} ${themes[theme].shadow}`}>
                <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Body Measurements</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                  {[
                    { field: 'height', options: ['160cm', '170cm', '180cm', '190cm', '200cm'] },
                    { field: 'weight', options: ['60kg', '70kg', '80kg', '90kg', '100kg'] },
                    { field: 'build', options: ['lean', 'regular', 'athletic', 'big'] }
                  ].map(({ field, options }) => (
                    <div key={field}>
                      <label className="block mb-1 text-xs md:text-sm font-medium capitalize">{field}</label>
                      <select
                        {...register(field)}
                        className={`w-full p-1 md:p-2 text-xs md:text-sm rounded-lg border ${themes[theme].input} ${themes[theme].bg}`}
                      >
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className={`p-2 md:p-4 rounded-lg ${themes[theme].panel} ${themes[theme].shadow}`}>
                <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Custom Image</h2>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 md:p-6 text-center cursor-pointer transition-all ${
                    isDragActive 
                      ? 'border-blue-500 bg-blue-50/50' 
                      : `border-gray-300 hover:border-gray-400 ${themes[theme].input}`
                  }`}
                >
                  <input {...getInputProps()} />
                  {previewImage ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-16 h-16 md:w-24 md:h-24 object-contain mb-1 md:mb-2 rounded border"
                      />
                      <p className="text-xs">Click or drag to replace</p>
                      <p className="text-2xs text-gray-500 mt-0.5 md:mt-1">PNG, JPG, WEBP (max 5MB)</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <ImagePlus className="w-6 h-6 md:w-8 md:h-8 mb-1 md:mb-2" strokeWidth={1.5} />
                      <p className="text-xs md:text-sm mb-0.5 md:mb-1">Drag & drop your image here</p>
                      <p className="text-2xs md:text-xs">or click to browse files</p>
                      <p className="text-2xs mt-0.5 md:mt-1">Recommended: 1000×1000px transparent PNG</p>
                    </div>
                  )}
                </div>

                {previewImage && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs md:text-sm font-medium flex items-center gap-1">
                        <Minimize2 className="w-3 h-3" /> Image Size <Maximize2 className="w-3 h-3" />
                      </label>
                      <span className="text-xs">{imageSize}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={imageSize}
                      onChange={(e) => setImageSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Text Customization */}
              <div className={`p-2 md:p-4 rounded-lg ${themes[theme].panel} ${themes[theme].shadow}`}>
                <div className="flex justify-between items-center mb-2 md:mb-3">
                  <h2 className="text-base md:text-lg font-semibold flex items-center gap-1 md:gap-2">
                    <Type className="w-3 h-3 md:w-4 md:h-4" /> Custom Text
                  </h2>
                  <span className="text-xs md:text-sm text-gray-500">
                    {displayText.length}/15 characters
                  </span>
                </div>
                
                <input
                  type="text"
                  maxLength={15}
                  value={displayText}
                  onChange={handleTextChange}
                  placeholder="Enter text (max 15 characters)"
                  className={`w-full p-1 md:p-2 text-xs md:text-sm rounded-lg border mb-2 md:mb-3 ${themes[theme].input} ${themes[theme].bg}`}
                />
                
                {hasText && (
                  <div className="mb-2 md:mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs md:text-sm font-medium flex items-center gap-1">
                        <Minimize2 className="w-3 h-3" /> Text Size <Maximize2 className="w-3 h-3" />
                      </label>
                      <span className="text-xs">{textSize}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={textSize}
                      onChange={(e) => setTextSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  <div>
                    <label className="block mb-1 text-xs md:text-sm font-medium">Text Color</label>
                    <select
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className={`w-full p-1 md:p-2 text-xs md:text-sm rounded-lg border ${themes[theme].input} ${themes[theme].bg}`}
                    >
                      <option value="white">White</option>
                      <option value="black">Black</option>
                      <option value="#FF0000">Red</option>
                      <option value="#00FF00">Green</option>
                      <option value="#0000FF">Blue</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-xs md:text-sm font-medium">Text Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="textBackground"
                        checked={textBackground}
                        onChange={(e) => setTextBackground(e.target.checked)}
                        className="w-3 h-3 rounded border-gray-300"
                      />
                      <label htmlFor="textBackground" className="text-xs md:text-sm">
                        Add background
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2 md:py-3 px-4 rounded-lg text-white font-bold text-xs md:text-sm ${themes[theme].button} ${themes[theme].shadow} transition-all hover:shadow-lg`}
              >
                Create Custom T-Shirt - $29.99
              </button>
            </form>

            <div className="text-center text-2xs md:text-xs text-gray-500 py-1 md:py-2">
              Press <strong>Alt+Q</strong> to switch themes • Current: {themes[theme].name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TShirtCustomizer;