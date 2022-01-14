export class MatrixSchema{
  // Normalizar caracteres especiales, mayúsculas, etc.
  // FALTA: redimensionar matrix según la cantidad de palabras o su longitud
  // Mejorar: en vez de empezar desde el primer match de celdas, recorrerlas aleatoriamente
  constructor(words){
    this.width = Math.max(...words.map(w => {return w.length}))+2
    this.height = this.width
    this.matrix = this.initializeMatrix(this.width, this.height, "")
    this.words = this.sortWords(words).map( word => {return word.toUpperCase()}).filter(word => { return word !== ""})
    this.glossary = {
      horizontal: [],
      vertical: []
    }
    this.horizontalLastNumber = 1
    this.verticalLastNumber = 1
  }

  findMatches(letter){
    let matches_coord = []
    for(let i = 0; i < this.matrix.length; i++){
      for(let j = 0; j < this.matrix[i].length; j++){
        if(letter === this.matrix[i][j].filling){
          if(this.matrix[i][j].direction !== 'cross'){
            matches_coord.push([i,j])
          }
        }
      }
    }
    return matches_coord
  }

  deployWords(){
    let tries = 0;
    let ready = false
    while(!ready || tries < 150){
      tries++
      // Crea/reinicia un arreglo con todas las palabras
      let words = this.words.map((w) => {return w})
      // Para probar con otro emplazamiento inicial, reinicia la matriz
      this.resetMatrix();
      // Se obtiene una dirección y posición aleatoria para la palabra inicial
      let initialDisposal = this.getRandomInteger(0,1) // 0 for horizontal, 1 for vertical
      if(initialDisposal === 0){
        let remaining_cells = this.width - words[0].length
        let initialColumn = Math.round(remaining_cells/2)+1
        let r = this.getRandomInteger(0, this.height-1)
        this.matrix[r][initialColumn].number = this.horizontalLastNumber
        for(let i = 0; i < words[0].length; i++){
          this.matrix[r][initialColumn+i].filling = words[0][i]
          this.matrix[r][initialColumn+i].direction = 'horizontal'
        }
        this.glossary.horizontal.push({
          word: words[0],
          number: this.horizontalLastNumber
        })
        this.horizontalLastNumber++
      }
      else if(initialDisposal === 1){
        let remaining_cells = this.height - words[0].length
        let initialRow = Math.round(remaining_cells/2)
        let c = this.getRandomInteger(0, this.width-1)
        this.matrix[initialRow][c].number = this.verticalLastNumber
        for(let i = 0; i < words[0].length; i++){
          this.matrix[initialRow+i][c].filling = words[0][i]
          this.matrix[initialRow+i][c].direction = 'vertical'
        }
        this.glossary.vertical.push({
          word: words[0],
          number: this.verticalLastNumber
        })
        this.verticalLastNumber++
      }
      //console.log("Se ubicó la primer palabra")
      // Se elimina la primer palabra del arreglo
      words.shift()
      let words_list_loop = 0;
      // Inicia un bucle que dura mientras haya palabras en el arreglo o hasta completar 100 intentos
      while(words.length > 0 && words_list_loop < this.words.length * 2){
        words_list_loop++
        // Se recorre cada palabra para encontrar ubicación. Si no se encuentra, se pasa a la siguiente palabra
        for(let g = 0; g < words.length; g++){
          //console.log(words)
          let finded = false
          for(let i = 0; i < words[g].length; i++){
            let matches = this.findMatches(words[g][i])
            for(let j = 0; j < matches.length; j++){
              let wordFits = this.wordFits(words[g], i, matches[j])
              if(wordFits === 'horizontal'){
                if(this.isEnviromentEmpty(words[g], matches[j], i, 'horizontal')){
                  //console.log("La palabra: " + words[g] + "entra en " + matches[j])
                  let initialCell = matches[j][1] - i
                  this.matrix[matches[j][0]][initialCell].number = this.horizontalLastNumber
                  for(let k = 0; k < words[g].length; k++){
                    let actual_column = parseInt(initialCell) + k
                    // Si ya hay otra letra, entonces la celda es de cruce
                    if(this.matrix[matches[j][0]][actual_column].filling !== " "){
                      this.matrix[matches[j][0]][actual_column].direction = 'cross'
                    }
                    // Si no es de cruce, entonces se señala la dirección de la palabra emplazada
                    else{
                      this.matrix[matches[j][0]][actual_column].direction = 'horizontal'
                    }
                    this.matrix[matches[j][0]][actual_column].filling = words[g][k]
                  }
                  this.glossary.horizontal.push({
                    word: words[g],
                    number: this.horizontalLastNumber
                  })
                  this.horizontalLastNumber++
                  words.splice(g,1)
                  finded = true
                }
              }
              else if(wordFits === 'vertical'){
                if(this.isEnviromentEmpty(words[g], matches[j], i, 'vertical')){
                  //console.log("La palabra: " + words[g] + "entra en " + matches[j])
                  let initialCell = matches[j][0] - i
                  this.matrix[initialCell][matches[j][1]].number = this.verticalLastNumber
                  for(let k = 0; k < words[g].length; k++){
                    let actual_row = parseInt(initialCell)+k
                    // Si ya hay otra letra, entonces la celda es de cruce
                    if(this.matrix[actual_row][matches[j][1]].filling !== " "){
                      this.matrix[actual_row][matches[j][1]].direction = 'cross'
                    }
                    // Si no es de cruce, entonces se señala la dirección de la palabra emplazada
                    else{
                      this.matrix[actual_row][matches[j][1]].direction = 'vertical'
                    }
                    this.matrix[actual_row][matches[j][1]].filling = words[g][k]
                  }
                  this.glossary.vertical.push({
                    word: words[g],
                    number: this.verticalLastNumber
                  })
                  this.verticalLastNumber += 1
                  words.splice(g,1)
                  finded = true
                }
              }
              if(finded){
                break
              }
            }
            if(finded){
              break
            }
          }
        }
        if(words.length === 0){
          ready = true
        }
      }
      //console.log("word_list_loop: "+words_list_loop)
    }
    //console.log("tries: "+tries)
  }

  wordFits(word, letter_position, cell){

    let r = cell[0]
    let c = cell[1]

    let fitHorizontal = () => { // Se pregunta si la palabra cabe horizontalmente en el tablero
      if ( c - letter_position >= 0 ) { // Hay lugar hacia la izquierda del cruce
        if( word.length - letter_position + c <= this.width ){ // Hay lugar hacia la derecha del cruce
          //let fits = true // La palabra cabe en la matrix hasta que se pruebe lo contrario
          for(let i = 0; i < word.length; i++){ // Recorre todas las celdas de la matrix donde iría la nueva palabra
            let actual_cell = this.matrix[r][c-letter_position+i]
            if(actual_cell.filling !== " " ){
              if(actual_cell.filling !== word[i]){
                return false
              }
              else if(actual_cell.direction === 'horizontal'){
                return false
              }
            }
          }
          return true
        }
      }
    }
    let fitVertical = () => {
      if ( r - letter_position >= 0){ // Se pregunta si la palabra cabe hacia arriba del cruce
        if ( word.length - letter_position + r <= this.height) { // Se pregunta si la palabra cabe hacia abajo
          for(let i = 0; i < word.length; i++){ // Recorre todas las celdas de la matrix donde iría la nueva palabra
            let actual_cell = this.matrix[r-letter_position+i][c]
            if(actual_cell.filling !== " " ){
              if(actual_cell.filling !== word[i]){
                return false
              }
              else if(actual_cell.direction === 'vertical'){
                return false
              }
            }
          }
          return true
        }
      }
    }
    // Se establece para la palabra la dirección opuesta a la de la celda con la que se cruza
    if(this.matrix[r][c].direction === 'horizontal'){
      if(fitVertical()){
        return 'vertical'
      }
    }
    else{
      if(fitHorizontal()){
        return 'horizontal'
      }
    }

  }

  isEnviromentEmpty(word, initial_cell, position, direction){
    // horizontal
    //console.log("Word: "+word+" / Cross cell: "+ initial_cell + " para la posición " + position + " / Direction: "+direction)
    if(direction === 'horizontal'){
      let r = initial_cell[0]
      let c = initial_cell[1]-position
      // EVALUAR
      // Si la celda izquierda está vacía
      // Si la celda posterior al final está vacía
      // Si las celdas paralelas están vacías o están ocupadas por una palabra en dirección opuesta y esta la atraviesa
      if(this.matrix[r][c-1]){
        if(this.matrix[r][c-1].filling !== " "){
          //console.log("1 La celda previa está ocupada")
          return false
        }
      }
      if(this.matrix[r][c+word.length]){
        if(this.matrix[r][c+word.length].filling !== " "){
          //console.log("2 La celda posterior está ocupada")
          return false
        }
      }
      for(let i = 0; i < word.length; i++){
        if(this.matrix[r+1]){
          if(this.matrix[r+1][c+i].filling !== " " && this.matrix[r+1][c+i].direction !== 'vertical'){
            //console.log("3 La celda "+(r+1)+", "+(c+i)+" está ocupada.")
            return false
          }
          if(this.matrix[r+1][c+i].filling !== " " && this.matrix[r+1][c+i].direction === 'vertical' && this.matrix[r][c+i].filling === " "){
            //console.log("4 La celda "+(r+1)+", "+(c+i)+" está ocupada.")
            return false
          }
        }
        if(this.matrix[r-1]){
          if(this.matrix[r-1][c+i].filling !== " " && this.matrix[r-1][c+i].direction !== 'vertical'){
            //console.log("5 La celda "+(r-1)+", "+(c+i)+" está ocupada.")
            return false
          }
          if(this.matrix[r-1][c+i].filling !== " " && this.matrix[r-1][c+i].direction === 'vertical' && this.matrix[r][c+i].filling === " "){
            //console.log("6 La celda "+(r-1)+", "+(c+i)+" está ocupada.")
            return false
          }
        }
      }
      return true
    }
    if(direction === 'vertical'){

      let r = initial_cell[0]-position
      let c = initial_cell[1]

      if(this.matrix[r-1]){
        if(this.matrix[r-1][c].filling !== " "){
          //console.log("7 La celda previa está ocupada")
          return false
        }
      }
      if(this.matrix[r+word.length]){
        if(this.matrix[r+word.length][c].filling !== " "){
          //console.log("8 La celda posterior está ocupada")
          return false
        }
      }
      for(let i = 0; i < word.length; i++){
        if(this.matrix[r+i][c-1]){
          if(this.matrix[r+i][c-1].filling !== " " && this.matrix[r+i][c-1].direction !== 'horizontal'){
           // console.log("9 La celda "+(r+i)+", "+(c-1)+" está ocupada")
            return false
          }
          if(this.matrix[r+i][c-1].filling !== " " && this.matrix[r+i][c-1].direction === 'horizontal' && this.matrix[r+i][c].filling === " "){
            //console.log("10 La celda "+(r+i)+", "+(c-1)+" está ocupada")
            return false
          }
        }
        if(this.matrix[r+i][c+1]){
          if(this.matrix[r+i][c+1].filling !== " " && this.matrix[r+i][c+1].direction !== 'horizontal'){
            //console.log("11 La celda "+(r+i)+", "+(c+1)+" está ocupada")
            return false
          }
          if(this.matrix[r+i][c+1].filling !== " " && this.matrix[r+i][c+1].direction === 'horizontal' && this.matrix[r+i][c].filling === " "){
            //console.log("12 La celda "+(r+i)+", "+(c+1)+" está ocupada")
            return false
          }
        }
      }
      return true
    }
  }

  getRandomInteger(min, max){
    return Math.round(Math.random() * (max - min)) + min
  }

  randomInitialCell(word_length){

  }

  sortWords(words){
    return words.sort((a, b) => {
      if (a.length < b.length) {
        return 1
      }
      else if(a.length === b.length){
        return 0
      }
      else return -1
    })
  }

  initializeMatrix(width, height){
    let matrix = []
    for(let i = 0; i < width; i++){
      let row = []
      for(let i = 0; i < width; i++){
        row.push({
          filling: " ",
          direction: null,
          number: null
        })
      }
      matrix.push(row)
    }
    return matrix
  }

  resetMatrix(){
    for(let i = 0; i < this.matrix.length; i++){
      for(let j = 0; j < this.matrix[i].length; j++){
        this.matrix[i][j].filling = " "
        this.matrix[i][j].direction = null
        this.matrix[i][j].number = null
      }
    }
    this.glossary.vertical = []
    this.glossary.horizontal = []
    this.horizontalLastNumber = 1
    this.verticalLastNumber = 1
    console.log("numbers reseted")
  }

  getCW(){
    this.resetMatrix()
    this.deployWords()
    return {
      matrix: this.matrix,
      horizontal: this.glossary.horizontal,
      vertical: this.glossary.vertical,
      words_left: this.words
    }
  }

  getWidth(){
    return this.width
  }

  getHeight(){
    return this.height
  }

  printMatrix(){
    for(let i = 0; i < this.matrix.length; i++){
      let line = ""
      for(let j = 0; j < this.matrix[i].length; j++){
        line = line + "| " + this.matrix[i][j].filling
      }
      console.log(line+"\n")
    }
  }

}
