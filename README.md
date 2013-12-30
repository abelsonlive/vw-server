# vw-server
A node wrapper around `vowpal_wabbit` that provides a more accessible server.

## Quickstart
- [Install `vw`](https://github.com/JohnLangford/vowpal_wabbit/wiki/Tutorial)
- Download vw-server: `$ git clone git@github.com:yhat/vw-server.git`
- Install vw-server: `$ npm install -g`
- Start the server!
```bash
$ vw-server
```

## Data Structure
- `features` - Data you're using to predict a label. Needs to be a key/value.
The features are not order dependent (`vw` remembers the names), so be sure
to maintain consistent feature names.
- `label` - Result/Outcome you're trying to predict.

### Training Data
```javascript
{
  "features": {
    "x": 1,
    "y": 2,
    "z": 4
  },
  "label": 1
}
```

### Prediction Data
```javascript
{
  "features": {
    "x": 1,
    "y": 2,
    "z": 4
  }
}
```

## Endpoints
There are 2 ways to interact with `vw-server`: REST and WebSockets. Both accept 
the same basic data structure, so it's a matter of personal preference as to 
which one you use.

### REST
#### `/train`
```bash
$ curl -X POST -d '{"features": {"x": 1, "y": 2}, "label": 1 }' localhost:3000/train
$ curl -X POST -d '{"features": {"x": 0, "y": 1.5}, "label": 2 }' localhost:3000/train
$ curl -X POST -d '{"features": {"x": 1, "y": 1.7}, "label": 1 }' localhost:3000/train
```

#### `/predict`
```bash
$ curl -X POST -d '{"features": {"x": 1, "y": 2}}' localhost:3000/predict
$ curl -X POST -d '{"features": {"x": 0, "y": 1.5}}' localhost:3000/predict
$ curl -X POST -d '{"features": {"x": 1, "y": 1.7}}' localhost:3000/predict
```

### WebSockets
#### `train`
```javascript
var socket = io.connect();

# sending to the server
socket.emit("train", {"x": 1, "y": 2}, "label": 0});
socket.emit("train", {"x": 1, "y": 4}, "label": 1});
// coming back from the server
socket.on("train", function(data) {
  console.log(data);
});
```
#### `predict`
```javascript
var socket = io.connect();
// sending to the server
socket.emit("predict", {"x": 1, "y": 2});
socket.emit("predict", {"x": 1, "y": 4});
// coming back from the server
socket.on("predict", function(data) {
  console.log(data);
});
```

## Tuning `vw`
You can pass arguemnts to `vw-server` the same as you would with `vw`.

```bash
$ vw-server --csoaa 3
$ vw-server --adaptive
```

## Misc
You can set the port by using an environment variable:
```bash
$ export PORT=5000
$ vw-server
# starting vw:
#   vw --adaptive --normalized -p /dev/stdout
# listening on port 5000
```

