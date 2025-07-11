export class Timer{

    constructor(name){
        this.name = name
        this.time = 0
        this.element = null
        this.control = false
        this.callback = null
        this.timeLimit = 10
        this.timeoutID = null
    }

    set(time, element, callback = null)
    {
        this.time = time
        this.element = element
        this.callback = callback
    }

    setTimeLimit(timeLimit)
    { 
        this.timeLimit = timeLimit
    }

    start()
    {
        this.control = true
        console.log("Timer started for: " + this.name)
        this.timeoutID = setTimeout(() => {
            this.countDown()
        }, 1000)
    }

    format() {
        let hours = parseInt(this.time / 3600);
        let timeLeft = this.time - hours * 3600;
        let minutes = parseInt(timeLeft / 60);
        timeLeft = timeLeft - minutes * 60;
        let seconds = timeLeft;
        
        hours = hours.toString();
        minutes = minutes.toString();
        seconds = seconds.toString();
    
        if (hours.length == 1)
            hours = '0' + hours;
        if (minutes.length == 1)
            minutes = '0' + minutes;
        if (seconds.length == 1)
            seconds = '0' + seconds;
        
        return hours + ':' + minutes + ':' + seconds;
    }

    static formatInputTime(time)
    {
        let hours = parseInt(time / 3600);
        let timeLeft = time - hours * 3600;
        let minutes = parseInt(timeLeft / 60);
        timeLeft = timeLeft - minutes * 60;
        let seconds = timeLeft;
        
        hours = hours.toString();
        minutes = minutes.toString();
        seconds = seconds.toString();
    
        if (hours.length == 1)
            hours = '0' + hours;
        if (minutes.length == 1)
            minutes = '0' + minutes;
        if (seconds.length == 1)
            seconds = '0' + seconds;
        
        return hours + ':' + minutes + ':' + seconds;
    }

    countDown()
    {
        if(!this.control)
        {
            return
        }

        let timerBlock = this.element
        timerBlock.innerHTML = this.format()
        timerBlock.style.display = 'block'

        if(this.time <= 59)
        {
            timerBlock.style.color = 'red'
        }

        if(this.time <= 0)
        {
            timerBlock.innerHTML = 'Time\'s up!'
            this.callback()
            this.stop()
        }
        else
        {
            this.timeoutID = setTimeout(() => {
                this.countDown()
            }, 1000)
            this.time--
            console.log("countdown called")
        }
    }

    stop()
    {
        this.control = false
        clearTimeout(this.timeoutID)
    }

}