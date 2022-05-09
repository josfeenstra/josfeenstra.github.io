# Open and add a source to a destination by appending to the destination
def openAndAdd(source, destination):
    sourceFile = open(source, "r");
    destinationFile = open(destination, "a");

    # Write the source file into the destination file
    destinationFile.write("// " + source);
    destinationFile.write('\n');
    destinationFile.write(sourceFile.read());
    destinationFile.write('\n');

    sourceFile.close();
    destinationFile.close();


# Get the filename of a source file from a html line
def getSourceFromLine(line):
    try:
        line = line[(line.index("src")+ 5):-1];
        line = line[0:line.index('"')];
        return line;
    except:
        return "";
    

# Open a file and concatenate its scripts to a destination file
def concatenateScripts(index, destination):
    indexFile = open(index, "r");

    # Read all lines
    lines = indexFile.readlines();
    for line in lines:
        # Filter for lines that include javascript files
        if "text/javascript" in line:
            source = getSourceFromLine(line);
            if source != "":
                openAndAdd(source, destination);
                print(source, ' added to ', destination);

    indexFile.close();

concatenateScripts("index.html", "game.min.js");
