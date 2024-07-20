const { syncHandler } = require("./functionWrappers");

module.exports.formatValidationError = syncHandler(function (error) {
  var errors = {};
  for (const field in error.errors) {
    errors[field] = error.errors[field].message;
  }

  error.name = "ValidationError"
  error.message = "Auth Validation Failed";
  error.statusCode = 400;
  error.errors = errors;

  return error;
});

module.exports.getError = syncHandler(function (statusCode, name, message) {
  const error = new Error(message);
  error.name = name;
  error.statusCode = statusCode;
  return error;
});

module.exports.unexpectedError = syncHandler(function (statusCode) {
  if (!statusCode) {
    statusCode = 500;
  }
  return module.exports.getError(
    statusCode,
    "Error",
    "An unexpected error occurred"
  );
});

module.exports.formatOrderForUser = syncHandler(function (order, orderdetails) {
  return {
    id: order._id,
    status: order.status,
    details: orderdetails.orderdetails,
    price: order.price,
    pickupTime: order.pickupTime,
    feedback: order.feedback,
    transactionId: order.transactionId,
    address: order.address,
  };
});

module.exports.formatOrderForStaff = syncHandler(function (
  order,
  orderDetails,
  username
) {
  return {
    orderdetails: orderDetails.orderdetails,
    status: order.status,
    orderid: order._id,
    user: username,
    price: order.price,
    transactionId: order.transactionId,
    address: order.address,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    feedback: order.feedback,
    pickupTime: order.pickupTime,
  };
});

module.exports.formatOrderTrackData = syncHandler(function (order) {
  let orderdata = {};
  orderdata.orderid = order._id;
  orderdata.status = order.status;
  orderdata.pickupTime = order.pickupTime;
  orderdata.address = order.address;
  orderdata.steps = 0;
  if (order.status === "Accepted") {
    orderdata.steps = 1;
  } else if (order.status === "In Progress") {
    orderdata.steps = 2;
  } else if (order.status === "On the Way") {
    orderdata.steps = 3;
  } else if (order.status === "Completed") {
    orderdata.steps = 4;
  }
  return orderdata;
});
