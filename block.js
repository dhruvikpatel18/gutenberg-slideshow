const { registerBlockType } = wp.blocks;
const { TextControl, Button, ToggleControl, Spinner } = wp.components;
const { withState } = wp.compose;
const { withSelect } = wp.data;
const { decodeEntities } = wp.htmlEntities;

registerBlockType('gutenberg-slideshow/script-block', {
    title: 'rtcamp Slideshow',
    icon: 'slides',
    category: 'common',
    attributes: {
        apiUrl: {
            type: 'string',
            default: 'https://wptavern.com/wp-json/wp/v2/posts',
        },
        numPosts: {
            type: 'number',
            default: 5,
        },
        autoScroll: {
            type: 'boolean',
            default: true,
        },
        showTitle: {
            type: 'boolean',
            default: true,
        },
        showImage: {
            type: 'boolean',
            default: true,
        },
        showDate: {
            type: 'boolean',
            default: true,
        },
    },
    edit: withState({ loading: false, livePreview: null })(function(props) {
        const { attributes, setAttributes, loading, setState } = props;
        const [posts, setPosts] = useState([]);
        const [currentIndex, setCurrentIndex] = useState(0);

        const fetchPosts = () => {

            // Check if data is cached in local storage
            const cachedData = localStorage.getItem('gutenbergSlideshowData');

            if (cachedData) {
                setPosts(JSON.parse(cachedData));
                return;
            }

            // Set loading state while fetching data
            setState({ loading: true, livePreview: null });

            fetch(attributes.apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Cache the fetched data in local storage
                    localStorage.setItem('gutenbergSlideshowData', JSON.stringify(data));

                    setPosts(data);
                    setCurrentIndex(0);
                    setState({ loading: false, livePreview: 0 });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setState({ loading: false });
                });
        };

         // Function to handle keyboard navigation
         const handleKeyboardNavigation = (event) => {
            if (event.key === 'ArrowRight') {
                // Move to the next slide
                setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));
            } else if (event.key === 'ArrowLeft') {
                // Move to the previous slide
                setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
            }
        };

        // Function to handle touch start event
        const handleTouchStart = (event) => {
            setTouchStartX(event.touches[0].clientX);
        };

        // Function to handle touch end event and trigger swipe navigation
        const handleTouchEnd = (event) => {
            const touchEndX = event.changedTouches[0].clientX;
            const touchSensitivity = 50; // Adjust sensitivity as needed

            if (touchStartX - touchEndX > touchSensitivity) {
                // Swipe left, move to the next slide
                setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));
            } else if (touchEndX - touchStartX > touchSensitivity) {
                // Swipe right, move to the previous slide
                setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
            }
        };

        const handleInputChange = (newApiUrl) => {
            // Clear the cached data when the API URL changes
            localStorage.removeItem('gutenbergSlideshowData');

            setAttributes({ apiUrl: newApiUrl });
        };

        const handleCacheClear = () => {
            // Clear the cached data manually
            localStorage.removeItem('gutenbergSlideshowData');
            setPosts([]);
        };

        const handleChangeWebsite = () => {
            // Fetch data from the new API URL when the "Change Website" button is clicked
            fetchPosts();
        };



        useEffect(() => {
            fetchPosts();

            //event listener for keyboard navigation
            document.addEventListener('keydown', handleKeyboardNavigation);
            document.addEventListener('touchstart', handleTouchStart);
            document.addEventListener('touchend', handleTouchEnd);

            // Remove it when the block is unmounted
            return () => {
                document.removeEventListener('keydown', handleKeyboardNavigation);
                document.removeEventListener('touchstart', handleTouchStart);
                document.removeEventListener('touchend', handleTouchEnd);
            };
        }, [attributes.apiUrl]); // Fetch data when the apiUrl attribute changes

        const prevSlide = () => {
            setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
        };

        const nextSlide = () => {
            setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));
        };

        const currentPost = posts[currentIndex];

        return (
            <div className="slideshow">
                <TextControl
                    label="API Endpoint URL"
                    value={attributes.apiUrl}
                    onChange={handleInputChange}
                />
                <TextControl
                    label="Number of Posts"
                    type="number"
                    value={attributes.numPosts}
                    onChange={value => setAttributes({ numPosts: parseInt(value) })}
                />
                <ToggleControl
                    label="Auto-Scroll"
                    checked={attributes.autoScroll}
                    onChange={value => setAttributes({ autoScroll: value })}
                />
                <ToggleControl
                    label="Show Post Title"
                    checked={attributes.showTitle}
                    onChange={value => setAttributes({ showTitle: value })}
                />
                <ToggleControl
                    label="Show Featured Image"
                    checked={attributes.showImage}
                    onChange={value => setAttributes({ showImage: value })}
                />
                <ToggleControl
                    label="Show Post Date"
                    checked={attributes.showDate}
                    onChange={value => setAttributes({ showDate: value })}
                />
                <Button onClick={fetchPosts}>Fetch Data</Button>
                <Button onClick={handleChangeWebsite}>Change Website</Button>
                <Button onClick={handleCacheClear}>Clear Cache</Button>
                {loading && <Spinner />}
                {posts.length > 0 && (
                    <div className="slideshow">
                    <div className="slide">
                        <h2>
                            <a href={currentPost.link} target="_blank" rel="noopener noreferrer">
                                {decodeEntities(currentPost.title.rendered)}
                            </a>
                        </h2>
                        <p>{new Date(currentPost.date).toLocaleDateString()}</p>
                        <img src={currentPost.featured_media} alt={currentPost.title.rendered} />
                    </div>
                    <div className="nav">
                        <button onClick={prevSlide}>&#8592; Prev</button>
                        <button onClick={nextSlide}>Next &#8594;</button>
                    </div>
                </div>
                )}
                {loading || (
                    <div className="live-preview">
                        <h3>Live Preview</h3>
                        {livePreview !== null && (
                            <div className="slide">
                            <h2>
                                <a href={posts[livePreview].link} target="_blank" rel="noopener noreferrer">
                                    {decodeEntities(posts[livePreview].title.rendered)}
                                </a>
                            </h2>
                            <p>{new Date(posts[livePreview].date).toLocaleDateString()}</p>
                            <img src={posts[livePreview].featured_media} alt={posts[livePreview].title.rendered} />
                        </div>
                        )}
                    </div>
                )}
            </div>
        );
    }),
    save: function() {
        // This block is dynamic, so no need to save content here
        return null;
    },
});