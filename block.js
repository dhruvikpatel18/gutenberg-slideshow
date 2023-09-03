const { registerBlockType } = wp.blocks;
const { TextControl, Button, Spinner } = wp.components;
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
    },
    edit: withState({ loading: false })(function(props) {
        const { attributes, setAttributes, loading } = props;

        const [posts, setPosts] = useState([]);
        const [currentIndex, setCurrentIndex] = useState(0);

        const fetchPosts = () => {
            // Set loading state while fetching data
            props.setState({ loading: true });

            fetch(attributes.apiUrl)
                .then(response => response.json())
                .then(data => {
                    setPosts(data);
                    setCurrentIndex(0);
                    props.setState({ loading: false });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    props.setState({ loading: false });
                });
        };

        useEffect(() => {
            fetchPosts();
        }, []); // Fetch data on initial block load

        const prevSlide = () => {
            setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
        };

        const nextSlide = () => {
            setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));
        };

        const currentPost = posts[currentIndex];

        return (
            <div>
                <TextControl
                    label="API Endpoint URL"
                    value={attributes.apiUrl}
                    onChange={value => setAttributes({ apiUrl: value })}
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
            </div>
        );
    }),
    save: function() {
        // This block is dynamic, so no need to save content here
        return null;
    },
});