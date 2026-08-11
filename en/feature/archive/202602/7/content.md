---
title: "Patrick's stream processing front-end"
---
<FeatureHead
    title="Patrick's stream processing front-end"
    authorName="Patrick"
    cover = '../../../../../feature/archive/202602/_assets/7.png'
    resourceLink = '../_assets/流处理前置.zip'
/>

## Summary
This frontend imitates Java and provides some common methods for processing objects in arrays (here called streams), as well as batch processing methods. (Mapper method is not provided)
**Most** of the content in this document can be found in the project comments.

### The scoring items and command storage involved in this preset

The scoring items and command storage used by data pack are listed here. Do not change its value without knowing the consequences.
This prefix involves a scoring item: stream
The stream contains the following virtual players:
You're usually free to access their values if you need to, but please don't change them

·**catche**: The cache subscript used when finding the maximum value and minimum value and temporarily storing the results during batch processing
·**index**: used to record the index of the current iteration during foreach
·**length**: used to record the length of the current stream during foreach
·**size**: Used to record the number of parameters to be retained/skipped during limit and skip.
·**result**: A virtual player used to temporarily store the output results when reading function output (such as comparison or filter)

This frontend involves 5 command stores.

·**patrickstool:stream/constant_stream** New stream created during operation. Usually used to overwrite the original address later, the internal value is the stream
·**patrickstool:stream/operated** An element that is taken out separately during operation is usually the element being operated. The internal value is the element, index is the subscript, and address is the address.
·**patrickstool:stream/compared** An element that is taken out separately during operation is usually used for comparison with the previous one. The internal value is the element, index is the subscript, and address is the address.
·**patrickstool:stream/record** is used to store commands for passing parameters to macro functions.
·**patrickstool:stream/command** is used by the batch method to temporarily store the command

When in use, usually only access the **patrickstool:stream/record**command storage.

### Parameter passing instructions

**Every** stream processing function requires $(address) to specify the address of the stream, ** which should contain the source of an NBT object and an NBT path to the stream for searching within it. **
For example: If you want to pass in the command to store the stream value under foo:bar, then you need to pass in "storage foo:bar value"
If you want to pass in playerSteve's backpack as a stream, you need to pass in "entity Steve Inventory" (note that this front-end function still cannot directly modify player data)

Some functions need to specify the function to be used. In the absence of special requirements, the specified function should be a macro function. See below for the parameters accepted.

Since the parameters of the function used are placed in the command storage patrickstool:stream/record, if you want to pass additional parameters, you can put the parameters in patrickstool:stream/record, but do not occupy the keywords value, index, function, length, address, result, resultBatch, first, second and size! (If you want to pass in parameters with similar functions, it is recommended to add a prefix)The function function used by foreach and filter can accept value parameters, address parameters, index parameters and length parameters. The value parameter is the object being executed, address is the address of the stream, index is the subscript of the object in the stream, and the length parameter is the length of the stream.

The comparator function specified by max, min, and sort does not accept the value parameter, but instead accepts the first and second parameters. These two parameters are the two elements in the stream to be compared (note that there is a distinction between order). Other than that, the acceptable parameters are the same as above.

#### The following operations may cause serious bugs:

· Randomly operate the command storage and scoring items mentioned above.
·The entered address is not a stream.

### Stream processing function description
The stream processing functions described here are all functions under the path **patrickstool:stream/**
Example: countfunction represents function "patrickstool:stream/count"
**All** stream processing functions need to pass in the address parameter to indicate the address of the stream to be processed. This address should contain the source of an NBT object and an NBT path pointing to the stream for searching within it. The functions mentioned below do not write this additionally.

#### 1. count
Used to get the number of elements in the stream.
Input: No additional parameters are required.
Output: The number of elements in the stream.

#### 2. distinct
Deduplicate objects in a stream
Input: No additional parameters are required, **but the stream specified by address is required to be an object stream** (that is, all elements in the stream are objects)
Output: None.

#### 3. filter
To filter the stream using specified rules, a function parameter is required to specify the function used as the condition. If the function returns 1, the element can be retained, otherwise the element is removed from the stream.
Input: Requires a string function specifying the conditional function to use.
Output: None.

#### 4.foreach
Applies the specified function once to each element in the stream.
Input: Requires a string function specifying the function to use.
Output: None.

#### 5. limit
Keep the first few elements in the stream and discard the rest.
Input: An integer size is required to specify how many elements to retain.
Output: None.

#### 6. max_index
Find the largest element in the stream according to the specified comparison rules.
Input: Requires a string function specifying the function to use. As a comparator, this function accepts two parameters, first and second, and returns 1 indicating that the former is greater than the latter.
Output: the index of the largest element.

#### 7.min_index
Find the smallest element in the stream according to the specified comparison rules.
Input: Requires a string function specifying the function to use. As a comparator, this function accepts two parameters, first and second, and returns 1 indicating that the former is greater than the latter.
Output: the subscript of the smallest element.

#### 8.reverse
Reverses the order of elements in the stream.
Input: No additional parameters are required.
Output: None

#### 9. skip
Remove the first few elements from the stream and keep the remaining elements.
Input: An integer size is required to specify how many elements to skip.
Output: None

#### 10. sort
Sort the streams sequentially (from small to large) according to the specified comparison rules.
Input: Requires a string function specifying the function to use. As a comparator, this function accepts two parameters, first and second, and returns 1 indicating that the former is greater than the latter.
Output: None

### Stream batch processing

In order to avoid entering too many repeated fields, this frontend provides a method to perform stream processing functions in batches.

#### 11. batch
Execute stream processing functions in batchesInput: A string array command specifies the batch processing function to be executed (omitting the "patrickstool:stream/" prefix), and a string integer mixed array argus specifies the parameters of each step, which corresponds to the content in command one-to-one.
Output: The sum of the output of all executed batch functions

The parameters in argus will be converted into function and size at the same time, so there is no need for the user to distinguish them.

### private method
The private method, also known as a private method, is a method in the private folder and is used for the intermediate execution process of the stream processing function. It is not recommended that users use the method in the private folder. None of the private methods support batching.
If you want to use it, there is a method that may work:

#### 12. private/get_from_index
Used to extract elements at specified positions in the stream into record
Input: An integer index is required to specify the subscript.
Output: No value is returned, and the value key in patrickstool:stream/record is automatically overwritten with the element with the specified subscript in the target stream.
