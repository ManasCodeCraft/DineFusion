const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const config = require('./config/config')
const app = express();
const mainRouter = require('./routers/mainRouter')
const authRouter = require('./routers/authRouter')
const canteenMenuRouter = require('./routers/canteenMenuRouter');
const orderRouter = require("./routers/orderRouters");
const feedbackRouter = require('./routers/feedbackRouter');
const { errorHandler } = require("./utils/asyncHandler");

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())

app.use(express.urlencoded({
    extended:true
}))

app.use(express.json());


app.use('/auth',authRouter)

app.use("/", mainRouter);
app.use('/menu',canteenMenuRouter)
app.use('/order',orderRouter)
app.use('/feedback',feedbackRouter)
app.route('/ownerpage').get((req,res)=>{
    res.redirect('/order/order-request')
})

app.use(errorHandler())

app.listen(config.port, ()=>{
    console.log(`Exprss Server is listening on port ${config.port}`)
});
