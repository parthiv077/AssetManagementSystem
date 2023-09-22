import java.util.*;
class Solution {
    public static void main(String arg[])
    {
        System.out.println(checkInclusion("acd","dcda"));
    }
    public static boolean checkInclusion(String s1, String s2) {
        for(int i=0;i<s2.length();i++)
        {
            ArrayList<Character> list = new ArrayList<>();
            char[] charArray = s1.toCharArray();
            for(int z=0;z<charArray.length;z++)
            {
                list.add(charArray[z]);
            }
            for(int j=0;j<s1.length();j++)
            {
                
                if(list.contains(s2.charAt(j+i)))
                {
                    list.remove(Character.valueOf(s2.charAt(j+i)));
                }
                else
                {
                    break;
                }
                if(list.isEmpty())
                {
                    return true;
                }
                
            }
        }
        return false;
    }
}