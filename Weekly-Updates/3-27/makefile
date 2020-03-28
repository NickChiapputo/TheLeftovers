PDF = pdflatex

UPD_SRC = update.tex
UPD_OUT = update
UPD_FLAGS = -halt-on-error -jobname=$(UPD_OUT)

pdf: clean $(UPD_SRC)
	$(PDF) $(UPD_FLAGS) $(UPD_SRC) && $(PDF) $(UPD_FLAGS) $(UPD_SRC) && make clean

clean:
	rm -f $(UPD_OUT).log $(UPD_OUT).aux $(UPD_OUT).out
