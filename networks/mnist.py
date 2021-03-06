from __future__ import print_function
import argparse
import torch
import numpy as np
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms
from sklearn.manifold import TSNE
from torch.autograd import Variable

# Training settings
parser = argparse.ArgumentParser(description='PyTorch MNIST Example')
parser.add_argument('--batch-size', type=int, default=64, metavar='N',
                    help='input batch size for training (default: 64)')
parser.add_argument('--test-batch-size', type=int, default=500, metavar='N',
                    help='input batch size for testing (default: 1000)')
parser.add_argument('--epochs', type=int, default=5, metavar='N',
                    help='number of epochs to train (default: 10)')
parser.add_argument('--lr', type=float, default=0.01, metavar='LR',
                    help='learning rate (default: 0.01)')
parser.add_argument('--momentum', type=float, default=0.5, metavar='M',
                    help='SGD momentum (default: 0.5)')
parser.add_argument('--no-cuda', action='store_true', default=False,
                    help='disables CUDA training')
parser.add_argument('--seed', type=int, default=1, metavar='S',
                    help='random seed (default: 1)')
parser.add_argument('--log-interval', type=int, default=10, metavar='N',
                    help='how many batches to wait before logging training status')
parser.add_argument('--output-tsne', type=bool, default=False)
args = parser.parse_args()
args.cuda = not args.no_cuda and torch.cuda.is_available()

torch.manual_seed(args.seed)
if args.cuda:
    torch.cuda.manual_seed(args.seed)

if not args.output_tsne:
    content = np.array([], dtype='str').reshape(0,15)
else:
    content = np.array([], dtype='str').reshape(0,7)

kwargs = {'num_workers': 1, 'pin_memory': True} if args.cuda else {}
train_loader = torch.utils.data.DataLoader(
    datasets.MNIST('datasets/mnist/', train=True, download=True,
                   transform=transforms.Compose([
                       transforms.ToTensor(),
                       transforms.Normalize((0.1307,), (0.3081,))
                   ])),
    batch_size=args.batch_size, shuffle=True, **kwargs)
test_loader = torch.utils.data.DataLoader(
    datasets.MNIST('datasets/mnist/', train=False, transform=transforms.Compose([
                       transforms.ToTensor(),
                       transforms.Normalize((0.1307,), (0.3081,))
                   ])),
    batch_size=args.test_batch_size, shuffle=False, **kwargs)


class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
        self.conv2_drop = nn.Dropout2d()
        self.fc1 = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, 10)

    def forward(self, x):
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
        x = x.view(-1, 320)
        fc1 = F.relu(self.fc1(x))
        x = F.dropout(fc1, training=self.training)
        x = self.fc2(x)
        return F.log_softmax(x), fc1

model = Net()
if args.cuda:
    model.cuda()

optimizer = optim.SGD(model.parameters(), lr=args.lr, momentum=args.momentum)

def train(epoch, content):
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        if args.cuda:
            data, target = data.cuda(), target.cuda()
        data, target = Variable(data), Variable(target)
        optimizer.zero_grad()
        output, fc1 = model(data)
        loss = F.nll_loss(output, target)
        loss.backward()
        optimizer.step()
        if batch_idx % args.log_interval == 0:
            print('Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}'.format(
                epoch, batch_idx * len(data), len(train_loader.dataset),
                100. * batch_idx / len(train_loader), loss.data[0]))
        if batch_idx % (10) == 0:
            content = outputTest(epoch, batch_idx, content, 500)
    return content

def test():
    model.eval()
    test_loss = 0
    correct = 0
    for data, target in test_loader:
        if args.cuda:
            data, target = data.cuda(), target.cuda()
        data, target = Variable(data, volatile=True), Variable(target)
        output, fc1 = model(data)
        test_loss += F.nll_loss(output, target, size_average=False).data[0] # sum up batch loss
        pred = output.data.max(1, keepdim=True)[1] # get the index of the max log-probability
        correct += pred.eq(target.data.view_as(pred)).cpu().sum()

    test_loss /= len(test_loader.dataset)
    print('\nTest set: Average loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n'.format(
        test_loss, correct, len(test_loader.dataset),
        100. * correct / len(test_loader.dataset)))
        
def outputTest(epoch, batch_idx, content, size):
    model.eval()
    test_loss = 0
    labels = np.array([], dtype='str').reshape(0,1)
    index = 0
    
    if not args.output_tsne:
        probability = np.array([], dtype='str').reshape(0,10)
    else:
        probability = np.array([], dtype='str').reshape(0,2)

    for data, target in test_loader:
        if args.cuda:
            data, target = data.cuda(), target.cuda()
        data, target = Variable(data, volatile=True), Variable(target)
        output, fc1 = model(data)
        labels = np.concatenate((labels, np.expand_dims(target.data.cpu().numpy(), axis=1).astype('str')), axis=0)
        if not args.output_tsne:
            probability = np.concatenate((probability, np.exp(output.data.cpu().numpy()).astype('str')), axis=0)
        else:
            features_embedded = TSNE(n_components=2, perplexity=40).fit_transform(fc1.data.cpu().numpy()).astype('str')
            probability = np.concatenate((probability, features_embedded.astype('str')), axis=0)
            
        test_loss += F.nll_loss(output, target, size_average=False).data[0] # sum up batch loss
        #pred = output.data.max(1, keepdim=True)[1] # get the index of the max log-probability
        index += 1
        if size / args.test_batch_size >= index:
            break

    test_loss /= size
    
    epochs = np.expand_dims(np.repeat(str(epoch), size), axis=1)
    batchIds = np.expand_dims(np.repeat(str(batch_idx), size), axis=1)
    loss = np.expand_dims(np.repeat(test_loss, size), axis=1)
    path = np.expand_dims(np.array([str(i+1)+'.png' for i in range(size)]), axis=1)
    combine = np.concatenate((epochs, loss, batchIds, labels, path, probability), axis=1)
    
    return np.concatenate((content, combine), axis=0)
    

for epoch in range(1, args.epochs + 1):
    content = train(epoch, content)
    #test()

if not args.output_tsne:
    header = "Epoch,Loss,BatchId,Label,Path," + ",".join([str(i) for i in range(10)])    
    np.savetxt('log/mnist-500-fixed-interval.csv', content, delimiter=',',comments='', header=header, fmt="%s") 
else:
    header = "Epoch,Loss,BatchId,Label,Path,X,Y"
    np.savetxt('log/mnist-500-tsne-data.csv', content, delimiter=',',comments='', header=header, fmt="%s") 



    