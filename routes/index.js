

const constructorMethod = (app) => {
    app.use('*', (req, res) => {
        res.status(404).json({ error: '404 Not found' });
    });
};
export default constructorMethod;