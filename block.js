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
            default: 'https://example.com/wp-json/wp/v2/posts',
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

        // ... (previous code for rendering and navigation)

        return (
            <div>
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
                    // ... (previous code for rendering slideshow)
                )}
                {loading || (
                    <div className="live-preview">
                        <h3>Live Preview</h3>
                        {livePreview !== null && (
                            // ... (previous code for rendering live preview)
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