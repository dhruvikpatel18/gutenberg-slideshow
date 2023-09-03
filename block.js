const { registerBlockType } = wp.blocks;
const { TextControl, Button } = wp.components;
const { useState } = wp.element;
const { apiFetch } = wp;


registerBlockType('gutenberg-slideshow/script-block', {
    title: 'rtcamp Slideshow',
    icon: 'slides',
    category: 'common',
    attributes: {
        apiUrl: {
            type: 'string',
            default: 'https://wptavern.com/wp-json/wp/v2/posts',
        },
        posts: {
            type: 'array',
            default: [],
        },
    },

    edit: function(props) {
        const { attributes, setAttributes } = props;
        const { apiUrl } = attributes;
        const [posts, setPosts] = useState(attributes.posts);

        const fetchLatestPosts = () => {
            apiFetch({ path: apiUrl })
                .then((data) => {
                    setPosts(data);
                    setAttributes({ posts: data });
                })
                .catch((error) => {
                    console.error(error);
                });
        };
        const postElements = posts.map((post) => (
            <div key={post.id}>
                <h2>{post.title.rendered}</h2>
                <p>{post.content.rendered}</p>
            </div>
        ));
        return (
            <div>
           <Button onClick={fetchLatestPosts}>Fetch Latest Posts</Button>
           {postElements}
       </div>
        );
    },

    save: function() {
        
        return null;
    },
});
