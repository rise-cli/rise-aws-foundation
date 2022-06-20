# Rise AWS Foundation

The aws sdk gives us a lot of power and options. This is a good thing, but can also
be an exhausting, overwhelming, and paralyzing at times. The purpose of this project is to provide a layer on top of the sdk that is:

-   opinionated
-   focused
-   stable

The goal is to change the experience of building with aws. Instead of feeling heavy and complicated, we aim to make building with aws light and simple.

## Philosophy of project

This project initially started as a serverless framework called rise. Eventually it became clear we needed to experiment with many different kinds of abstractions. This became difficult because every new experiment involved a lot of work. It was costly to experiment.

In order to make experiments lighter and less costly, we created rise foundation. The strategy is as follows:

-   commit to using rise foundation over the aws sdk
-   stability is achieved in rise foundation by making aws sdk abstractions as simple as possible. We try not to add too much logic at this layer.
-   The belief here is we are more productive and creative when we become eloquent with a few core tools rather than barely fluent with kitchen sink sdk's

## Installation

You can use rise foundation in your project by npm installing it:

```
npm i rise-aws-foundation
```

## What do the tree icons mean in the navigation?

This project has not reached 1.0.0 yet. Everything should be considered experimental, apis may change in the future. These icons are to give you a sense of how far along each resource is.

-   🌲 Is being used in Rise Frameworks, and has integration tests
-   🌿 Is being used in Rise Frameowkrs, is not yet covered in integration tests
-   🌱 Is not being used in Rise Frameworks yet, is not yet covered in integration tests
