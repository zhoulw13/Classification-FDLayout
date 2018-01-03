# Classification-FDLayout

## Overview

Classification-FDLayout is a visulization tool to help visulizing deep learning procedure and results.

![FDLayout](https://github.com/zhoulw13/Classification-FDLayout/raw/master/doc/images/FDforClassification.gif)

The demo use [MNIST handwitten digit database](https://github.com/zhoulw13/Classification-FDLayout/blob/master/doc/images/FDforClassification.gif) as data. On the left side of the layout, there is a TSNE layout as a comparison. On the middle part of the layout, there is our force-directed layout. And on the right side of the layout, there are some useful information about the deep learning training.

## Requirements

You need python and django to run the project. After installation, go to `FDforClassification` folder of this project and run:
```
python manage.py runserver
```
Now you can brose `http://127.0.0.1:8000` to see the result according to the instractions in the terminal.

## Functions

The T-SNE panel on the left is only build for reference. You can see why we force-directed layout instead of T-SNE there. The main part of the project that we want to show is the FD-layout in the middle. On the whole, T-SNE is not as flexible as fd-layout. It takes more time to iterate and unpredictable on the cordinate values changing step by step. We should say that TSNE is more suitable for visulizing static data instead of dynamic data changing while training.

### Run the training

Hit the Run button to the top right corner, and the layout will change according to the training results. We use a small neural network to train the classification job. It is not state of the art performance of course. Just for show.

### FD-layout

Big colorful dots represent class of the dataset, e.g digit 1 or 5. Small black dots represent training sample of the dataset which means every image of digit dataset.

You can drag and drop any part of the layout. It will move the way it should be.

### User interface

You can hit any class of the dataset - big colorful dots in the FD-Layout. And see the information of that class on the right panel.

The distance of sample dots and class dots is their degree of confidence.

You can also hit any sample of the dataset - small black dots in the FD-Layout. And see what class it should be on the right. And that should help you when you find a special sample that corrupt the training.

All you need to do is to figure out what the training moves every step and what strange data corrupt your traning. The others are handed over to the layout.
