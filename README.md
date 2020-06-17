Bitcoin Transaction Maker
============================
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Simple project where we can answer to some of bitcoin questions.

How to create bitcoin transaction? Where can I get inputs and outputs? How do I calculate bitcoin transaction fee?

You are welcome to take the code and use it in your awesome project.

## Usage
```
var response = await transferBalance(publicKeyFrom, privateKeyFrom, publicKeyTo)
```

or
```
transferBalance(
        "tb1qvf7ydmztc33fef653wdjx37euvf3ae9y6al6al",
        "cPjtFKXchdwr1efVtdbruBy3RF4dTLJoED7p8MXF6hw1R1ypYM4f",
        "tb1q5rg9st5qtyfql944yclshac2pc2zcfprylt037"
        ).then((data) => {
  console.log(data)
});
```

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

