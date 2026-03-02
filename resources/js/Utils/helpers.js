/**
 * Helper to use Ziggy route() in React components
 */
export function route(name, params, absolute, config) {
    if (typeof window.route === 'undefined') {
        console.error('Ziggy route helper is not available. Make sure @routes is in your app.blade.php');
        return '';
    }
    return window.route(name, params, absolute, config);
}
