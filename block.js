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
            // Set loading state while fetching data
            setState({ loading: true, livePreview: null });

            fetch(attributes.apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Limit fetched posts based on numPosts setting
                    const limitedPosts = data.slice(0, attributes.numPosts);
                    setPosts(limitedPosts);
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

        useEffect(() => {
            fetchPosts();

            //event listener for keyboard navigation
            document.addEventListener('keydown', handleKeyboardNavigation);

            // Remove it when the block is unmounted
            return () => {
                document.removeEventListener('keydown', handleKeyboardNavigation);
            };
        }, []); // Fetch data on initial block load

        const prevSlide = () => {
            setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
        };

        const nextSlide = () => {
            setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));
        };

        const currentPost = posts[currentIndex];

        return (
            <div className={slideshowClass}>
                <TextControl
                    label="API Endpoint URL"
                    value={attributes.apiUrl}
                    onChange={value => setAttributes({ apiUrl: value })}
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