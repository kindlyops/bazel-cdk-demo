package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
)

type manifest struct {
	Name string `json:"name"`
	Hash string `json:"hash"`
}

func main() {
	var output string = os.Args[1]
	files := os.Args[2:]
	count := len(files)
	hashes := make([]manifest, count)
	hasher := sha256.New()
	for i, file := range files {
		f, err := os.Open(file)
		if err != nil {
			log.Fatal(err)
		}
		defer f.Close()
		if _, err := io.Copy(hasher, f); err != nil {
			log.Fatal(err)
		}
		hash := fmt.Sprintf("%x", hasher.Sum(nil))
		hashes[i] = manifest{Name: file, Hash: hash}
		hasher.Reset()
	}
	j, err := json.Marshal(hashes)

	if err != nil {
		fmt.Printf("Error generating manifest: %s\n", err.Error())
	}

	err = ioutil.WriteFile(output, j, 0644)
	if err != nil {
		fmt.Printf("Error writing manifest to file: %s\n", err.Error())
	}
}
