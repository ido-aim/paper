# Squeeze Momentum 3

First of All, I would like to give my gratitude to [LAZYBEAR] for the initital script's idea.

This is my own version of SQZMOM. I had revised all equations and parameters according to Investopedia.

Still, no matter how much we stick to the indicator, the indicator can not see the future. 

Trading results vary from time to time. In my opinion, SQZMOM is great for speculating under 4H timeframe.

Remarks;

- implement horizontal shift
- revised all equations. Unfortunately, there is no magic params.
- Be careful with your money management
- Good Luck

```js
//
// Original Author [Lazybear] : https://www.tradingview.com/v/4IneGo8h/
// Contributor : @exaim1 on twitter : https://twitter.com/exaim1
// Contributor Version : 3
// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// Script reference : https://www.tradingview.com/pine-script-reference/
//
```
```python
//@version=5
indicator(shorttitle = "SQZMOM3", title="Squeeze Momentum 3", overlay=false)
lengthBB = input(20, title="BB Length - smoothing period length, typically 20")
multBB = input(2, title="BB mult - number of BB std, typically 2")
lengthKC=input(20, title="KC Length - for EMA, typically over 20 periods")
lengthATR=input(20, title="ATR Length - for ATR, typically over 10 or 20 periods")
multKC = input(2, title="KC MultFactor - number of KC std, set to = BB std")
shift = input(-2,title="Period Shift - negative values shift to the past")

// high,low,close are SERIES variable
source = close

// Calculate Bollinger Band (BB)
// source : https://www.investopedia.com/terms/b/bollingerbands.asp
tp = math.avg(high,low,close)
sd = multKC * ta.stdev(tp, lengthBB)
basis = ta.ema(tp, lengthBB)
upperBB = basis + sd
lowerBB = basis - sd

// Calculate Keltner Channels (KC)
// source : https://www.investopedia.com/terms/k/keltnerchannel.asp
ma = ta.ema(source, lengthKC)
// using true length by default
// ATR source : https://www.investopedia.com/articles/trading/08/average-true-range.asp
// ref : https://www.tradingview.com/pine-script-reference/#fun_ta{dot}atr
ATR = ta.atr(lengthATR)
upperKC = ma + ATR * multKC
lowerKC = ma - ATR * multKC

// Calculate squeeze
sqzOn  = (lowerBB > lowerKC) and (upperBB < upperKC)
sqzOff = (lowerBB < lowerKC) and (upperBB > upperKC)
noSqz  = (sqzOn == false) and (sqzOff == false)

// Plot
// Linear regression : https://stackoverflow.com/questions/57674892/how-is-this-linear-regression-calculated
val = ta.linreg(source  -  math.avg(math.avg(ta.highest(high, lengthKC), ta.lowest(low, lengthKC)),ta.ema(close,lengthKC)), lengthKC,0)

// iff(condition, result1, result2)
// nz() - return 0, if Na
down_color = val < nz(val[1]) ? color.red : color.maroon
up_color = val > nz(val[1]) ? color.lime : color.green
his_color = val > 0 ? up_color : down_color
dot_color = noSqz ? color.black : sqzOn ? color.yellow : color.white 

// plot main graph
plot(val, color=his_color, style=plot.style_histogram, linewidth=4, offset = shift)
plot(0, color=dot_color, style=plot.plot.style_cross, linewidth=2, offset = shift)

```