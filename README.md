# node-vw
A node wrapper around `vowpal_wabbit`



## Endpoints

#### `/train`
```
$ curl -X POST -d '{"features": {"x": 1, "y": 2}, "label": 1 }' localhost:3000/train
$ curl -X POST -d '{"features": {"x": 0, "y": 1.5}, "label": 2 }' localhost:3000/train
$ curl -X POST -d '{"features": {"x": 1, "y": 1.7}, "label": 1 }' localhost:3000/train
```

#### `/predict`
```
$ curl -X POST -d '{"features": {"x": 1, "y": 2}}' localhost:3000/predict
$ curl -X POST -d '{"features": {"x": 0, "y": 1.5}}' localhost:3000/predict
$ curl -X POST -d '{"features": {"x": 1, "y": 1.7}}' localhost:3000/predict
```

## socket events

#### `train`
```
var socket = io.connect();
socket.emit("train", {"x": 1, "y": 2}, "label": 0});
socket.emit("train", {"x": 1, "y": 4}, "label": 1});
```
#### `predict`
```
var socket = io.connect();
socket.emit("predict", {"x": 1, "y": 2});
socket.emit("predict", {"x": 1, "y": 4});
```

#### `training`
```
socket.on("training", function(data) {
  console.log(data);
});
```
#### `prediction`
```
socket.on("prediction", function(data) {
  console.log(data);
});
```
