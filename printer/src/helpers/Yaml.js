export const YAML = {
    valueOf: function(token) {
      return eval('(' + token + ')')
    },

    tokenize: function(str) {
      return str.match(/(---|true|false|null|#(.*)|\[(.*?)\]|\{(.*?)\}|[\w\-]+:|-(.+)|\d+\.\d+|\d+|\n+)/g)
    },

    strip: function(str) {
      return str.replace(/^\s*|\s*$/, '')
    },

    parse: function(tokens) {
      var token, list = /^-(.*)/, key = /^([\w\-]+):/, stack = {}
      while (token = tokens.shift())
        if (token[0] == '#' || token == '---' || token == "\n") 
          continue
        else if (key.exec(token) && tokens[0] == "\n")
          stack[RegExp.$1] = this.parse(tokens)
        else if (key.exec(token))
          stack[RegExp.$1] = this.valueOf(tokens.shift())
        else if (list.exec(token))
          (stack.constructor == Array ?
            stack : (stack = [])).push(this.strip(RegExp.$1))
      return stack
    },

    eval: function(str) {
      return this.parse(this.tokenize(str))
    }
  }

export function readJson (file) {
    // http://localhost:8080
    fetch(file)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .catch(function () {
        this.dataError = true;
    })
 }

 export async function readYaml (file) {
    
    let yaml = await fetch(file)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.text();
    })
    .catch(function () {
        this.dataError = true;
    })

    return YAML.eval(yaml)
 }